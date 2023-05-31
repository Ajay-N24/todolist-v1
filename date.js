module.exports=day;
function day(){
    let dat=new Date();
    let options={
        weekday:"long",
        day: "numeric",
        month: "long"
    }
    let day=dat.toLocaleDateString("en-US",options)
    return day;
}