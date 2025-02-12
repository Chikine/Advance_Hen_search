import {n21} from './dataContainer/nhen21.js'
import {n20} from './dataContainer/nhen20.js'
import {n19} from './dataContainer/nhen19.js'
import {n18} from './dataContainer/nhen18.js'
import {n17} from './dataContainer/nhen17.js'
import {n16} from './dataContainer/nhen16.js'
import {n15} from './dataContainer/nhen15.js'
import {n14} from './dataContainer/nhen14.js'
import {n13} from './dataContainer/nhen13.js'
import {n12} from './dataContainer/nhen12.js'
import {n11} from './dataContainer/nhen11.js'
import {n10} from './dataContainer/nhen10.js'
import {n9} from './dataContainer/nhen9.js'
import {n8} from './dataContainer/nhen8.js'
import {n7} from './dataContainer/nhen7.js'
import {n6} from './dataContainer/nhen6.js'
import {n5} from './dataContainer/nhen5.js'
import {n4} from './dataContainer/nhen4.js'
import {n3} from './dataContainer/nhen3.js'
import {n2} from './dataContainer/nhen2.js'
import {n1} from './dataContainer/nhen1.js'
const datas = [...n21, ...n20, ...n19, ...n18, ...n17, ...n16, ...n15, ...n14, ...n13, ...n12, ...n11, ...n10, ...n9, ...n8, ...n7, ...n6, ...n5, ...n4, ...n3, ...n2, ...n1,]
// import { copyArr } from '../../Hdata/J4F_HaitenCrawler/copy.js'
// let array = new Set()
// const tag = 'erome'
// datas.forEach(obj => {
//     if(obj[tag]) obj[tag].forEach(tag => {
//         array.add(tag)
//     })
// })
// const arr = [...array].sort((a,b) => a.localeCompare(b))
// copyArr(arr)
import {tag} from './dataContainer/nhenTag.js'
import {parody} from './dataContainer/nhenParody.js'
import {language} from './dataContainer/nhenLanguage.js'
import {group} from './dataContainer/nhenGroup.js'
import {character} from './dataContainer/nhenCharacter.js'
import {category} from './dataContainer/nhenCategory.js'
import {artist} from './dataContainer/nhenArtist.js'

const infos = {
    tag: tag,
    parody: parody,
    language: language,
    group: group,
    character: character,
    category: category,
    artist: artist
}
export {datas as nhenData}
export {infos as nhenInfo}