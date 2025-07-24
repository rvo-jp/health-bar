const fs = require('fs');
const { exit } = require('process');

const args = process.argv.slice(2);

let file = `entity/${args[0]}.json`;
let data;

try {
    data = JSON.parse(fs.readFileSync(file, 'utf8'));
} catch (err) {
    console.log("file not found");
    exit(1);
}

let dec = data["minecraft:client_entity"].description;

dec.materials.health_bar = "entity_emissive_alpha"
dec.geometry.health_bar = "geometry.health_bar"
dec.render_controllers.push(
    "controller.render.health_bar.bar",
    "controller.render.health_bar.heart",
    "controller.render.health_bar.digit1",
    "controller.render.health_bar.digit2",
    "controller.render.health_bar.digit3"
);

dec.textures.heart = "textures/health_bar/heart"
for (let i = 50; i >= 0; i --) {
    let n = String(i).padStart(2, '0');
    dec.textures["bar" + n] = "textures/health_bar/bar/" + n;
}
for (let i = 9; i >= 0; i --) {
    let n = String(i);
    dec.textures["font" + n] = "textures/health_bar/font/" + n;
}

if (dec.animations == undefined) dec.animations = {};

if (dec.scripts == undefined) dec.scripts = {}
if (dec.scripts.pre_animation == undefined) dec.scripts.pre_animation = []
dec.scripts.pre_animation.push("v.health = q.health;", "v.max_health = q.max_health;", `v.health_bar_position = ${args[1]};`)
if (dec.scripts.animate == undefined) dec.scripts.animate = []
if (dec.animation_controllers != undefined) {
    for (const contr of dec.animation_controllers) {
        let [key, value] = Object.entries(contr)[0];
        key += "_controller"
        dec.animations[key] = value
        dec.scripts.animate.push(key)
    }
    dec.animation_controllers = undefined
}

dec.animations.health_bar = "animation.health_bar";
dec.scripts.animate.push("health_bar")

data.format_version = "1.10.0"

// fs.unlinkSync(`entity_old/${args[0]}.json`)
fs.writeFileSync(file, JSON.stringify(data, undefined, 4))