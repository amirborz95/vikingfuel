const apiKey='b549e872b93c3f09e64d543f04980836';
const base='https://api2.postnord.com/rest';
const endpoints=['/shipment/v1/shipments','/shipment/v1/shipments.json','/shipment/v1/shipment','/shipment/v1/shipments/create','/shipment/v2/shipments','/shipment/v2/shipments.json','/shipment/v5/shipments','/shipment/v5/shipments.json'];
(async ()=>{
  for(const path of endpoints){
    const url=base+path+'?apikey='+apiKey;
    try{
      const res=await fetch(url,{method:'GET'});
      console.log(path, res.status, res.statusText);
      const txt=await res.text();
      console.log(txt.slice(0,400));
    }catch(e){
      console.log(path,'ERROR',e.message);
    }
    console.log('---');
  }
})();
