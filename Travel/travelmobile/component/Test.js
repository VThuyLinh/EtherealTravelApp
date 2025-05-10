const Test=()=>{
    let day1= new Date('2024-10-16T11:48:15.126221Z');
    let day2= new Date('2024-10-17T03:48:15.126221Z');
    const day3= new Date();
    const day4= new Date(day3.toUTCString());
    day2.setTime(1729050495150+86400000);
    console.warn(day3.getTime()+86400000);
    // console.warn(day2.getTime()- day1.getTime());

}
export default Test;