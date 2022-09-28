const countDays = (date) => {
    let day = 0
    let week = 0
    let month = 0
    let year = 0
    let dayUnit = ""
    let weekUnit = ""
    let monthUnit = ""
    let yearUnit = ""

    year = Math.floor(date/365)
    month = Math.floor((date%365)/30)
    week = Math.floor(((date%365)%30)/7)
    day = Math.floor(((date%365)%30)%7)

    year===1 ? yearUnit = "year" : yearUnit = "years"
    month===1 ? monthUnit = "month" : monthUnit = "months"
    week===1 ? weekUnit = "week" : weekUnit = "weeks"
    day===1 ? dayUnit = "day" : dayUnit = "days"

    const yearStr = year===0 ? "" : `${year} ${yearUnit}, `
    const monthStr = month===0 ? "" : `${month} ${monthUnit}, `
    const weekStr = week===0 ? "" : `${week} ${weekUnit}, `
    const dayStr = day===0 ? "" : `${day} ${dayUnit}`

    const str = `${yearStr}${monthStr}${weekStr}${dayStr}`

    return str
}