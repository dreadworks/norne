

norne.register("lukas", {
    
    hallo: function () {
        console.log("hallo");
    },

    x: 3

});

norne.lukas.hallo()


norne.register("lukasfn", function () {
    console.log("hallo!");
});

norne.lukasfn();



norne.register("felix", {
    x: 1
}, function (norne) {
    this.x = 2;
});

norne.felix.x // 1
norne.felix() 
norne.felix.x // 2


norne.unregister("felix");


// norne.obj

var proto = {
    proto1: "proto1"
}

norne.obj.define("world.lane");
var factory = norne.obj.get("world.lane");

factory.has(proto);
factory.use(norne.obj.create("evt"));

factory.as({
    y: 4
}, function (x) {
    this.x = x;
});

var inst1 = factory.create(4);


norne.obj.define("lukas").has(
    lukasproto
).use(
    norne.evt,
    norne.xy
).as({
    x: 2
}, function () {

});












