const { Tourney } = require('../models/tourneys')
const puppeteer = require('puppeteer')
const fs = require('fs')
const dayjs = require('dayjs')
const customParseFormat = require('dayjs/plugin/customParseFormat')

let months = {
  янв: 'Jan',
  фев: 'Feb',
  мар: 'Mar',
  апр: 'Apr',
  май: 'May',
  июн: 'Jun',
  июл: 'Jul',
  авг: 'Aug',
  сен: 'Sep',
  окт: 'Oct',
  ноя: 'Nov',
  дек: 'Dec'
}

const langHeaders = {'accept-language': 'en-GB,en;q=0.9,ru-RU;q=0.8,ru;q=0.7,en-US;q=0.6'}

class Bot {
  constructor(options = {}) {
    this.validate(options)

    this.debugMode = options.debugMode
    this.inputPages = options.inputPages
    this.linksParser = options.linksParser
    this.selectorToWaitOnPage = options.selectorToWaitOnPage
    this.links = []
    this.tourneysParsed = []
    this.handlers = options.handlers
    this.organisator = options.organisator
    this.botName = options.botName
    this.report = { botName: this.botName, added: 0, failed: 0 }
  }

  async start(headless = true) {
    console.log(`Starting ${this.botName}`)

    try {
      await this.openBrowser(headless)
      await this.getLinks()
      await this.excludeExistingTourneys()
      await this.parseTourneysUsingLinks()
    } catch (e) {
      console.log(`Error on start(): ${e.message}`)
      this.report.message = 'Error occured'
    }
    this.browser.close()
    return this.report
  }

  validate(options) {
    if (!options.handlers) throw Error('Handlers must be provided')

    if (!options.organisator) throw Error('Organisator name must be specified')

    if (!options.botName) throw Error('Bot name must be specified')

    if (!options.inputPages) throw Error('Input pages must be specified')
  }

  async openBrowser(headless) {
    this.browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless
    })
  }

  async insertSingleTourney(tourney) {
    if(new Date(tourney.date) < new Date()) return console.log('Outdated:', tourney.link)
    
    if (this.debugMode) console.log('Inserting...', tourney)

    tourney.id = (await this.getLastTourneyId()) + 1
    try {
      const result = await Tourney.insertMany(tourney).catch(err =>
        console.log('Error inserting tourney:', err.message)
      )
      console.log('Successfully inserted:', result[0].id)
      this.report.added++
    } catch (e) {
      console.log(`Error inserting tourney ${tourney.id}`)
      this.report.failed++
    }
  }

  async insertTourneys() {
    if (this.tourneysParsed.length == 0)
      return console.log('insertTourneys: no tourneys provided')

    let id = (await this.getLastTourneyId()) + 1
    this.tourneysParsed = this.tourneysParsed.map(val => ({
      ...val,
      ...{ id: id++ }
    }))
    console.log(this.tourneysParsed)

    const result = await Tourney.insertMany(this.tourneysParsed).catch(err =>
      console.log('Error inserting tourneys:', err.message)
    )

    if (result) {
      console.log(`Successfully added ${this.tourneysParsed.length} tourneys`)
      return { success: true, count: this.tourneysParsed.length }
    }
    if (result === 0) return { success: true, count: 0 }
  }

  /**
   * Collecting URLs on particular pages
   */
  async getLinks() {
    const page = await this.browser.newPage()
    page.setExtraHTTPHeaders(langHeaders)
    
    for (let inputPage of this.inputPages) {
      console.log(`Parsing ${inputPage.name} tourneys...`)
      await page.goto(inputPage.link)
      await this.beforeSearchingLinkSelector(page)

      try {
        await page.waitForSelector(this.linksParser.linkSelector)
      } catch (err) {
        console.log('Timeout. Skipping ', inputPage.url)
        return false
      }

      await this.beforeParsingLinks(page)

      let pageLinksList = await page.$$eval(
        this.linksParser.linkSelector,
        this.linksParser.handler
      )

      if (this.debugMode) console.log('PageLinksList:', pageLinksList)

      pageLinksList = pageLinksList.filter(val => !!val)
      console.log(`${pageLinksList.length} links loaded for ${inputPage.name}`)

      this.links.push(...pageLinksList)
    }

    console.log(`Loaded ${this.links.length} links`)

    await page.close()
  }

  /**
   * Parsing tourneys using URLs from this.links
   */
  async parseTourneysUsingLinks() {
    const page = await this.browser.newPage()
    page.setExtraHTTPHeaders(langHeaders)

    for (let link of this.links) {
      console.log(`Visiting ${link}`)

      await page.goto(link, { timeout: 0 })
      if (this.selectorToWaitOnPage)
        await page.waitForSelector(this.selectorToWaitOnPage)

      // objects that keeps data of how to process fields

      let tourney = {
        link: link,
        organisator: this.organisator,
        addedby: this.botName,
        status: 1
      }

      try {
        for (let field in this.handlers) {
          if (this.debugMode) console.log(`Parsing field: ${field}`)

          if (this.handlers[field].selector) {
            tourney[field] = await page.$$eval(
              this.handlers[field].selector,
              this.handlers[field].browserFormatter || undefined
            )
          }

          if (this.handlers[field].serverFormatter)
            tourney[field] = this.handlers[field].serverFormatter(
              tourney[field],
              tourney,
              this.handlers
            )

          if (this.debugMode)
            console.log(`For field [${field}] value set to [${tourney[field]}]`)
        }
      } catch (e) {
        console.log('Error on tourney ' + link)
        if (this.debugMode) console.log(e)

        this.report.failed++
        continue
      }
      // to add
      await this.insertSingleTourney(tourney)

      // if you ever want to add everything at once
      // this.tourneysParsed.push(tourney)
    }

    await page.close()
  }

  /**
   * Excludes existing tourneys URLs from this.links
   */
  async excludeExistingTourneys() {
    let linksInitially = this.links.length
    let existingTourneys = await Tourney.find({
      organisator: this.organisator
    })
      .select({ link: 1 })
      .sort({ date: -1 })
      .limit(5000)
      .catch(err => console.log('Bot error: ', err))

    this.links = this.links.filter(link => {
      let exists = existingTourneys.find(tourney => tourney.link == link)
      return !exists
    })

    console.log(
      `Excluded ${linksInitially -
        this.links
          .length} existing tourneys links out of ${linksInitially} links.`
    )
  }

  /**
   * @returns {number} – id of the last tourney published
   */
  async getLastTourneyId() {
    let id = await Tourney.find()
      .select({ id: 1 })
      .sort({ id: -1 })
      .limit(1)
      .catch(err => console.log('Bot error:', err))
    id = id[0] ? id[0].id : 0
    return id
  }

  /**
   * Triggered before searching for links
   */
  async beforeSearchingLinkSelector(page) {
    return null
  }
  /**
   * Triggered before parsing links on input pages
   */
  async beforeParsingLinks(page) {
    return null
  }
}

module.exports = Bot
