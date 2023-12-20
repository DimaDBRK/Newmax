// settings
const storeName = "Казань WB";
const cardId = 146972802;


// functions

// get card's ID's by main ID
async function getCardsIDsById(id) {
  try {
    const vol = id.toString().substring(0, 4);
    const part = id.toString().substring(0, 6);
    const link = wbUrlById(id);
    const response = await fetch(link + `/info/ru/card.json`, {
      method: 'GET',
    });

    const items = await response.json();
    const itemsIds = items.colors;
    //  Convert the elements from colors: [] to strings and join them with ';'
    const allCardsIds = `${itemsIds.map(String).join(';')}`;
    return allCardsIds;

  } catch (error) {
    console.error('Error in getCardsIDsById:', error.message);
    throw error; 
  }  
}

// link info by ID
function wbUrlById(id) {
  try {
    const nm = parseInt(id, 10);
    if (isNaN(nm)) {
      throw new Error("Invalid input. Please provide a valid ID.");
    }

    const vol = ~~(nm / 1e5);
    const part = ~~(nm / 1e3);
    let host;

    switch (true) {
      case vol >= 0 && vol <= 143:
        host = "//basket-01.wb.ru";
        break;
      case vol >= 144 && vol <= 287:
        host = "//basket-02.wb.ru";
        break;
      case vol >= 288 && vol <= 431:
        host = "//basket-03.wb.ru";
        break;
      case vol >= 432 && vol <= 719:
        host = "//basket-04.wb.ru";
        break;
      case vol >= 720 && vol <= 1007:
        host = "//basket-05.wb.ru";
        break;
      case vol >= 1008 && vol <= 1061:
        host = "//basket-06.wb.ru";
        break;
      case vol >= 1062 && vol <= 1115:
        host = "//basket-07.wb.ru";
        break;
      case vol >= 1116 && vol <= 1169:
        host = "//basket-08.wb.ru";
        break;
      case vol >= 1170 && vol <= 1313:
        host = "//basket-09.wb.ru";
        break;
      case vol >= 1314 && vol <= 1601:
        host = "//basket-10.wb.ru";
        break;
      case vol >= 1602 && vol <= 1655:
        host = "//basket-11.wb.ru";
        break;
      case vol >= 1656 && vol <= 1919:
        host = "//basket-12.wb.ru";
        break;
      case vol >= 1920 && vol <= 2045:
        host = "//basket-13.wb.ru";
        break;
      default:
        host = "//basket-14.wb.ru";
    }

    const res = `https:${host}/vol${vol}/part${part}/${nm}`;
    return res;

  } catch (error) {
    console.error("Error:", error.message);
    return null; 
  }
}

// get store id by name
async function getStoreIdByName(name) {
  try {
    const response = await fetch('https://static-basket-01.wbbasket.ru/vol0/data/stores-data.json', {
      method: 'GET',
    });

    const storesInfo = await response.json();
    const storeId = storesInfo.filter((item) => item.name === storeName)[0];
    if (!storeId) {
      throw new Error(`Store by name ${name} not found.`);
    }
    const res = storeId.id
    return res
  } catch (error) {
    console.error('Error in getStoreIdByName:', error.message);
    throw error; 
  }
}

// data parser
function parseElements(data, warehouseId) {
  const result = [];

  for (const element of data) {
    const artId = element.id || '';
    const stockInfo = {};

    if (element.sizes) {
      for (const size of element.sizes) {
        const stock = size.stocks.find(stock => stock.wh === warehouseId);

        if (stock) {
          stockInfo[size.origName] = stock.qty || 0;
        } else {
          stockInfo[size.origName] = 0;
        }
      }
    }

    result.push({ art: artId, stock: stockInfo });
  }

  return result;
}


// get stock info by main card ID
async function getStockInfoByCardId(id) {
  try {
    // get card's IDs by ID
    const cardsIDs = await getCardsIDsById(id);
    const link = `https://card.wb.ru/cards/v1/detail?appType=1&curr=rub&dest=-1257786&spp=27&nm=${cardsIDs}`
    const response = await fetch(link, {
      method: 'GET',
    });

    const data = await response.json();
    const warehouseId = await getStoreIdByName(storeName);
    console.log("warehouseId=>", warehouseId);
    // console.log("data=>", data["data"]["products"]);
    const res = parseElements(data["data"]["products"], warehouseId);
    console.log("res=>", res);
  } catch (error) {
    console.error('Error in getCardsIDsById:', error.message);
    throw error; 
  }  
}


// Driver
getStockInfoByCardId(cardId);


