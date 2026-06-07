const apiKey='b549e872b93c3f09e64d543f04980836';
const base='https://api2.postnord.com';
const endpoints=['/shipment/v1/shipments','/shipment/v1/shipments.json'];
(async ()=>{
  for(const path of endpoints){
    const url=base+path+'?apikey='+apiKey;
    try{
      const res=await fetch(url,{method:'GET'});
      console.log('GET',path,res.status,res.statusText);
      console.log((await res.text()).slice(0,300));
    }catch(e){console.log('GET',path,'ERROR',e.message);}
    try{
      const res=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify({foo:'bar'})});
      console.log('POST',path,res.status,res.statusText);
      console.log((await res.text()).slice(0,300));
    }catch(e){console.log('POST',path,'ERROR',e.message);}
    console.log('---');
  }
})();
