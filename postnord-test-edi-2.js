const url='https://api2.postnord.com/rest/shipment/v3/edi?apikey=b549e872b93c3f09e64d543f04980836';
const body = {
  messageDate: new Date().toISOString(),
  messageFunction: 'Instruction',
  messageId: 'msg-test-002',
  application: { applicationId: 1438, name: 'PostNord', version: '1.0' },
  updateIndicator: 'Original',
  shipment: [
    {
      shipmentIdentification: { shipmentId: '0' },
      dateAndTimes: { loadingDate: new Date().toISOString() },
      service: { basicServiceCode: '19' },
      numberOfPackages: { value: 1 },
      totalGrossWeight: { value: 1.0, unit: 'KGM' },
      parties: {
        consignor: {
          party: {
            nameIdentification: { name: 'Vikingfuel' },
            address: { streets: ['Mältarevägen 31'], postalCode: '34235', city: 'Alvesta', countryCode: 'SE' }
          }
        },
        consignee: {
          party: {
            nameIdentification: { name: 'Amir Bakalaev' },
            address: { streets: ['Mältarevägen 31'], postalCode: '34235', city: 'Alvesta', countryCode: 'SE' },
            contact: { contactName: 'Amir Bakalaev', emailAddress: 'amirborzlaev@gmail.com' }
          }
        }
      },
      goodsItem: [
        {
          packageTypeCode: 'PC',
          items: [ { itemIdentification: { itemId: '0', itemIdType: 'SSCC' }, grossWeight: { value: 1.0, unit: 'KGM' } } ]
        }
      ]
    }
  ]
};
(async()=>{ const res=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(body)}); console.log(res.status,res.statusText); console.log(await res.text()); })();
