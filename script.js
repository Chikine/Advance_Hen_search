import { f } from "./functions.js"
/* dropdown feature */
const availWeb = ['ihentai','nhentai']
const baseUrls = ['ihentai.us', 'nhentai.to']
let currentUrl = 'ihentai.us'
let currentWeb = 'ihentai'
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
    if(baseWeb === currentWeb) return
    currentWeb = baseWeb
    currentUrl = baseUrls[index]
    currentFilter = {}
    info.innerHTML = ''
    console.log(`change to ${baseWeb}`)
    switch(currentWeb) {
        case 'ihentai': 
            return getIhenInfo()
        default:
            console.error(`can't find the following web:`,baseWeb)
    }
}

//ihentai
import { ihenData, ihenInfo } from "./ihenData.js"
function getIhenInfo() {
    currentFilter['data'] = JSON.parse(JSON.stringify(ihenData))
    const search = ['tags', 'studio']
    search.forEach((key) => {
        currentFilter[key] = new Array(ihenInfo[key].length).fill(false)
        //container
        const keyDiv = document.createElement('div')
        keyDiv.className = 'keyDiv'
        //header
        const headerDiv = document.createElement('div')
        headerDiv.innerHTML = `<h2>${key}:</h2>`
        keyDiv.append(headerDiv)
        //elements
        ihenInfo[key].forEach((e, index) => {
            const ediv = document.createElement('div')
            ediv.classList = 'bubble no-select'
            ediv.textContent = e
            ediv.addEventListener('click', () => {
                currentFilter[key][index] = !currentFilter[key][index]
                ediv.style.backgroundColor = currentFilter[key][index] ? 'gray' : 'black'
            })
            keyDiv.append(ediv)
        })
        info.append(keyDiv)
    })
}
getIhenInfo()

/* handle get link after click linkfield */
const linkField = document.getElementById('linkField')
linkField.addEventListener('click', handleFiltered)
function handleFiltered() {
    let thisFilter = f.copyOf(currentFilter['data'])
    for(let key in currentFilter) {
        if(key != 'data') {
            currentFilter[key].forEach((e, index) => {
                if(!e) return
                const n = ihenInfo[key][index]
                thisFilter = thisFilter.filter(obj => obj[key].includes(n))
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
    const link = 'https://' + currentUrl + filteredArr[f.rand(0, filteredArr.length - 1)]['link']
    linkField.innerHTML = link
    const choice = document.getElementById('tab').value
    if(choice !== "noJump") window.open(link, "_blank")
}