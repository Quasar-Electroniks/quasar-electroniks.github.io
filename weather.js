(()=>{
  const widget=document.getElementById("weather");
  const icon=document.getElementById("weather-icon");
  const state=document.getElementById("weather-state");
  const temp=document.getElementById("weather-temp");
  if(!widget||!navigator.geolocation)return;

  const svg=body=>`<svg viewBox="0 0 24 24" aria-hidden="true">${body}</svg>`;
  const icons={
    sun:svg('<circle cx="12" cy="12" r="3.8"/><path d="M12 2.2v2M12 19.8v2M2.2 12h2M19.8 12h2M5.1 5.1l1.4 1.4M17.5 17.5l1.4 1.4M18.9 5.1l-1.4 1.4M6.5 17.5l-1.4 1.4"/>'),
    partly:svg('<circle cx="8.2" cy="8.2" r="3.2"/><path d="M8.2 2.5v1.2M3.9 3.9l.9.9M2.5 8.2h1.2M12.2 4.4l-.8.8"/><path d="M7 18.5h10.1a3.4 3.4 0 0 0 .3-6.8 5.1 5.1 0 0 0-9.7 1.4A2.7 2.7 0 0 0 7 18.5z"/>'),
    cloud:svg('<path d="M5.8 18.2h11.3a4 4 0 0 0 .4-8 5.8 5.8 0 0 0-11.1 1.6 3.2 3.2 0 0 0-.6 6.4z"/>'),
    fog:svg('<path d="M6 14.4h11.1a3.5 3.5 0 0 0 .4-7 5.2 5.2 0 0 0-9.9 1.4A2.8 2.8 0 0 0 6 14.4zM4 18h16M6.5 21h11"/>'),
    rain:svg('<path d="M5.8 14.4h11.3a3.6 3.6 0 0 0 .4-7.2A5.4 5.4 0 0 0 7.2 8.7a2.9 2.9 0 0 0-1.4 5.7zM8 17.3l-1 2.2M13 17.3l-1 2.2M18 17.3l-1 2.2"/>'),
    snow:svg('<path d="M5.8 13.8h11.3a3.5 3.5 0 0 0 .4-7A5.4 5.4 0 0 0 7.2 8.3a2.8 2.8 0 0 0-1.4 5.5z"/><path d="M8 17.2v3M6.7 18l2.6 1.5M9.3 18l-2.6 1.5M16 17.2v3M14.7 18l2.6 1.5M17.3 18l-2.6 1.5"/>'),
    storm:svg('<path d="M5.8 13.5h11.3a3.5 3.5 0 0 0 .4-7A5.4 5.4 0 0 0 7.2 8a2.8 2.8 0 0 0-1.4 5.5zM12.4 15.5l-2 3.2h2.3L11 22l4-4.7h-2.4l1.4-1.8"/>'),
    location:svg('<path d="M12 21s6-5.1 6-11a6 6 0 1 0-12 0c0 5.9 6 11 6 11z"/><circle cx="12" cy="10" r="2"/>')
  };
  const condition=code=>{
    if(code===0)return[icons.sun,"SENIN"];
    if(code<=2)return[icons.partly,"PARȚIAL NOROS"];
    if(code===3)return[icons.cloud,"ÎNNORAT"];
    if(code===45||code===48)return[icons.fog,"CEAȚĂ"];
    if(code>=51&&code<=57)return[icons.rain,"BURNIȚĂ"];
    if(code>=61&&code<=67)return[icons.rain,"PLOAIE"];
    if(code>=71&&code<=77)return[icons.snow,"NINSOARE"];
    if(code>=80&&code<=82)return[icons.rain,"AVERSE"];
    if(code>=85&&code<=86)return[icons.snow,"NINSOARE"];
    if(code>=95)return[icons.storm,"FURTUNĂ"];
    return[icons.cloud,"METEO LOCAL"];
  };
  const fail=()=>{
    widget.classList.remove("loading");widget.classList.add("error");
    icon.innerHTML=icons.location;state.textContent="LOCAȚIE OPRITĂ";temp.textContent="--°";
    widget.title="Permite accesul la locație pentru vremea locală";
  };
  const load=async ({coords})=>{
    try{
      const url=new URL("https://api.open-meteo.com/v1/forecast");
      url.search=new URLSearchParams({latitude:coords.latitude.toFixed(4),longitude:coords.longitude.toFixed(4),current:"temperature_2m,weather_code",timezone:"auto"});
      const response=await fetch(url);
      if(!response.ok)throw new Error("weather");
      const data=await response.json(),current=data.current;
      const [symbol,label]=condition(Number(current.weather_code));
      icon.innerHTML=symbol;state.textContent=label;
      temp.textContent=`${Math.round(Number(current.temperature_2m))}°C`;
      widget.classList.remove("loading","error");
      widget.title=`${label.toLowerCase()}, ${temp.textContent} în locația ta`;
    }catch{fail()}
  };
  icon.innerHTML=icons.location;widget.classList.add("loading");
  navigator.geolocation.getCurrentPosition(load,fail,{enableHighAccuracy:false,timeout:8000,maximumAge:600000});
})();
