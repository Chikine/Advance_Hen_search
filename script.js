import { f } from "./functions.js"
/* initial value */
//
const selector = document.getElementById('selector')
let currentSelect = 'default'
//
const chosenField = document.getElementById('chosenTag')
const ignoreField = document.getElementById('ignoreTag')
//
const availWeb = ['ihentai','nhentai']
const baseUrls = ['ihentai.us', 'nhentai.to']
let currentUrl = 'ihentai.us'
let currentWeb = 'ihentai'
let currentInfo = ihenInfo
//
/* dropdown feature */
const dropdown = document.getElementById('dropdown')
let hoverTimeout 
let notHoverTimeout
let dropdowning = false
dropdown.addEventListener('mouseenter', () => {
    clearTimeout(notHoverTimeout)
    if(dropdowning) return
    hoverTimeout = setTimeout(onHoverDropDown, 200)
})
dropdown.addEventListener('mouseleave', () => {
    clearTimeout(hoverTimeout)
    if(!dropdowning) return
    notHoverTimeout = setTimeout(notOnHoverDropDown, 200)
})

function onHoverDropDown() {
    dropdowning = true
    console.log('dropdown triggered')
    const selectDiv = document.createElement('div')
    selectDiv.id = 'dropdown-select'
    availWeb.forEach((web, index) => {
        // setTimeout(() => {
            if(!selectDiv) return
            const newDiv = document.createElement('div')
            newDiv.className = 'no-select'
            newDiv.textContent = `${web}`
            newDiv.addEventListener('click', () => {
                dropdowning = false
                selectDiv.remove()
                // currentWeb = web
                getInfo(web, index)
                document.getElementById('currentChoose').textContent = `source: ${availWeb[index]}`
            })
            newDiv.addEventListener('mouseenter', () => {
                newDiv.textContent = `<${web}>`
            })
            newDiv.addEventListener('mouseleave', () => {
                newDiv.textContent = `${web}`
            })
            selectDiv.append(newDiv)
        // },50 * index)
    })
    dropdown.append(selectDiv)
}

function notOnHoverDropDown() {
    dropdowning = false
    document.getElementById('dropdown-select').remove()
}

/*get informations */
let currentFilter = {}
const info = document.getElementById('informations')
function getInfo(baseWeb, index) {
    //same web -> return
    if(baseWeb === currentWeb) return
    //redeclare
    selector.innerHTML = '<option class="greenbg" value="default" selected>choose</option>'
    currentWeb = baseWeb
    currentUrl = baseUrls[index]
    currentFilter = {}
    info.innerHTML = ''
    //console log
    console.log(`change to ${baseWeb}`)
    //switch web
    switch(currentWeb) {
        case 'ihentai': 
            return getIhenInfo()
        case 'nhentai':
            return getNhenInfo()
        default:
            console.error(`can't find the following web:`,baseWeb)
    }
}

//ihentai
import { ihenData, ihenInfo } from "./ihenData.js"
function getIhenInfo() {
    currentInfo = ihenInfo
    currentFilter['data'] = JSON.parse(JSON.stringify(ihenData))
    const search = ['tags', 'studio']
    renderAll(search)
}
getIhenInfo()

//nhentai
import { nhenInfo, nhenData } from "./nhenData.js" //turn this into comment when adding features
function getNhenInfo() {
    currentInfo = nhenInfo
    currentFilter['data'] = JSON.parse(JSON.stringify(nhenData))
    const search = ['tag', 'parody', 'language', 'group', 'character', 'category', 'artist']
    renderAll(search)
}


/*render base on provided key */
function renderAll(keys) {
    keys.forEach((key) => {
        //chosen
        const chosenDiv = document.createElement('span')
        chosenDiv.id = `chosen_${key}`
        chosenField.append(chosenDiv)
        //ignore
        const ignoreDiv = document.createElement('span')
        ignoreDiv.id = `ignore_${key}`
        ignoreField.append(ignoreDiv)
        //info
        const infoDiv = document.createElement('span')
        infoDiv.id = `info_${key}`
        info.append(infoDiv)
        //option
        const option = document.createElement('option')
        option.value = key
        option.textContent = key
        selector.append(option)
        //filter key
        currentFilter[key] = new Array(currentInfo[key].length).fill(false)
        renderKey(key, 'off') 
    })
}
/* render object keys */
let userChoose = 'chosen'
function renderKey(key, filter, page = 1) {
    // console.trace('page:',page,'key:',key)
    //declare filter if undefined
    if(!filter) filter = []
    //get info div
    const e = document.getElementById(`info_${key}`)
    e.innerHTML = ''
    //container
    const keyDiv = document.createElement('div')
    keyDiv.className = 'keyDiv'
    //header
    const headerDiv = document.createElement('div')
    headerDiv.innerHTML = `
    <h2 class='trans-text no-select'>${key}: ${filter === 'off' ? '>' : 'v'}</h2>
    `
    keyDiv.append(headerDiv)
    //elements
    if(filter !== 'off') {
        //reset filter for chosen/ignore div
        const chosen = document.getElementById(`chosen_${key}`)
        chosen.innerHTML = ''
        const ignore = document.getElementById(`ignore_${key}`)
        ignore.innerHTML = ''
        //maximum bubbles can appear in 1 slot
        const maximumElement = 100
        let currentAmount = 0
        //filter base on current filter + addition filter
        currentInfo[key].forEach((e, index) => {
            //user choose that will show
            if(currentFilter[key][index]) {
                //add visible tag
                const newDiv = document.createElement('div')
                newDiv.classList = 'bubble no-select'
                newDiv.textContent = `${key} - ${e}`
                newDiv.addEventListener('click', () => {
                    currentFilter[key][index] = false
                    renderKey(key, filter)
                })
                document.getElementById(`${currentFilter[key][index]}_${key}`).append(newDiv)
            }
            //check filter
            if(filter[index]) return
            currentAmount++
            //add ... if reach the end of page
            if(currentAmount / maximumElement === page) {
                const etcDiv = document.createElement('div')
                etcDiv.classList = 'bubble no-select'
                etcDiv.textContent = '...'
                keyDiv.append(etcDiv)
            }
            //return if amount of element are full
            if(currentAmount / maximumElement >= page) return
            //key element that will show 
            const ediv = document.createElement('div')
            ediv.classList = 'bubble no-select'
            ediv.textContent = e
            ediv.style.backgroundColor = currentFilter[key][index] ? currentFilter[key][index] === 'chosen' ? 'gray' : 'red' : 'black'
            ediv.addEventListener('click', () => {
                currentFilter[key][index] = (currentFilter[key][index] && currentFilter[key][index] === userChoose) ? false : userChoose
                renderKey(key,filter)
            })
            headerDiv.addEventListener('click', () => {
                renderKey(key, 'off')
            })
            if((currentAmount / maximumElement) >= page - 1) keyDiv.append(ediv)
        })
        if(currentAmount > maximumElement) {
            const choosePage = document.createElement('div')
            choosePage.id = `${key}-search`
            const amountOfPages = f.floor(currentAmount / maximumElement) + ((currentAmount % maximumElement) ? 1 : 0)
            const thisPage = page
            // [1,page, amountOfPages].sort((a,b) => a - b)[1] //must be >= 1; <= amount
            //previous button
            if(thisPage > 1) {
                const buttonLeft = document.createElement('button')
                buttonLeft.textContent = '<'
                buttonLeft.addEventListener('click', () => {
                    renderKey(key, filter, thisPage - 1)
                })
                choosePage.append(buttonLeft)
            }
            //input field
            const inputPage = document.createElement('input')
            inputPage.value = thisPage
            inputPage.placeholder = `insert page (max page: ${amountOfPages})`
            //go button
            const goPage = document.createElement('button')
            goPage.textContent = 'go'
            goPage.addEventListener('click', () => {
                const n = Number(inputPage.value.trim())
                if(n === thisPage || Number.isNaN(n)) return
                renderKey(key, filter, n)
            })
            choosePage.append(inputPage)
            choosePage.append(goPage)
            //next button
            if(thisPage < amountOfPages) {
                const buttonRight = document.createElement('button')
                buttonRight.textContent = '>'
                buttonRight.addEventListener('click', () => {
                    renderKey(key, filter, thisPage + 1)
                })
                choosePage.append(buttonRight)
            }
            keyDiv.append(choosePage)
            if(currentAmount / maximumElement < page - 1) {
                const text = document.createElement('span')
                text.textContent = 'no result found'
                keyDiv.append(text)
            }
        }
    }
    else headerDiv.addEventListener('click', () => {
        renderKey(key)
    })
    e.append(keyDiv)
}
/*change chosen/ignore */
document.getElementById('chose').addEventListener('click', () => {
    userChoose = userChoose === 'chosen' ? 'ignore' : 'chosen'
    document.getElementById('chose').textContent = userChoose
    document.getElementById('choice').style.backgroundColor =  userChoose === 'chosen' ? 'green' : 'orange'
})
/* handle redirect link after click linkfield */
const linkField = document.getElementById('linkField')
linkField.addEventListener('click', handleFiltered)
function handleFiltered() {
    let thisFilter = f.copyOf(currentFilter['data'])
    for(let key in currentFilter) {
        if(key != 'data' && key != 'title' && key != 'title2') {
            currentFilter[key].forEach((e, index) => {
                if(!e) return
                const n = currentInfo[key][index]
                if(e === 'chosen') thisFilter = thisFilter.filter(obj => obj[key] && obj[key].includes(n))
                else thisFilter = thisFilter.filter(obj => !obj[key] || (obj[key] && !obj[key].includes(n)))
            })
        }
    }
    const filteredArr = [...thisFilter]
    if(!filteredArr.length) {
        alert(`no satisfy object found`)
        return
    }
    // console.log('all object found:', filteredArr)
    console.log(`found `,filteredArr.length, `objects satisfy`)
    redirectLink(filteredArr)
}

//
function redirectLink(arr) {
    const obj = arr[f.rand(0, arr.length - 1)]
    console.log(obj)
    const link = 'https://' + currentUrl + obj['link']
    linkField.innerHTML = link
    const option = document.getElementById('tab').value
    switch(option) {
        case 'normal' :
            return window.open(link, "_blank")
        // case 'here' :
        //     const film = ['ihentai']
        //     const manga = ['nhentai']
        //     const field = document.createElement('div')
        //     field.classList = 'fullScreen'
        //     if(film.includes(currentWeb)) {
        //         const ifr = document.createElement('iframe')
        //         ifr.src = obj['video']
        //         if(!ifr.src) return console.error('video source code not found')
        //         field.append(ifr)
        //     }
        //     document.body.append(field)
        case 'list' :
            const field = document.createElement('div')
            field.classList = 'fullScreen'
            const links = arr.map(obj => 'https://' + currentUrl + obj['link'])
            // field.innerHTML = `<div>${links.join('</div>\n<div>')}</div>`
            links.forEach(link => {
                const a = document.createElement('a')
                a.href = link
                a.textContent = link
                field.append(a)
            })
            const x = document.createElement('button')
            x.textContent = 'x'
            x.addEventListener('click', () => {field.remove()})
            field.append(x)
            document.body.append(field)
        default :
            console.log('no redirect')
    }
}
/* features */
//search feature 
let instantSearch = true

document.getElementById('instantSearch').addEventListener('click', () => {
    instantSearch = !instantSearch
    if(instantSearch){
        document.getElementById('instantSearch').style.backgroundColor = 'mediumpurple' 
        document.getElementById('searchInput').addEventListener('input', getInput)
    }
    else {
        document.getElementById('instantSearch').style.backgroundColor = 'white' 
        document.getElementById('searchInput').removeEventListener('input', getInput)
    }
})
document.getElementById('instantSearch').style.backgroundColor = 'mediumpurple' 
document.getElementById('searchInput').addEventListener('input', getInput)
function getInput() {
    const userInput = document.getElementById('searchInput').value.trim().toLowerCase()
    const value = selector.value
    if(value === 'default' || !currentFilter[value]) return
    let arr = []
    currentInfo[value].forEach((tag, index )=> {
        arr[index] = !(tag.split(' ').some(str => str.toLowerCase().startsWith(userInput)))
    })
    renderKey(value, arr)
}

document.getElementById('removeText').addEventListener('click', () => {
    const value = selector.value
    if(value === 'default') return
    document.getElementById('searchInput').value = ''
    renderKey(value)
})

selector.addEventListener('change', () => {
    if(currentSelect !== 'default') renderKey(currentSelect)
    currentSelect = selector.value
    getInput()
})