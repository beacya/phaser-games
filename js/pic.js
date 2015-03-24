/**
 * Created by sunbin on 14-10-8.
 */
var game = new Phaser.Game(480, 1200, Phaser.AUTO, 'item', { preload: preload, create: create, update: update,render:render });

var width = 160;
var height = 241;
var colNum;
var rowNum;
var ceilNum;
var ceilRandArr;//打乱后的随机排序
var ceilGroup;
var blankArrIndex;//空格在数组中索引
var view;
var stepNum = 0;
var seconds = 0;
function preload() {
    game.load.spritesheet('item', './images/pic.jpg', width, height);
    game.load.image('small', './images/pic.jpg', 480, 780);
}

function create() {

    var item;
    var itemNum = 0;
    colNum = 3;
    rowNum = 3;
    ceilNum   = 8;
    //计时
    var timer = setInterval(function(){
        if(seconds>9999){
            gameOver();
        }
        seconds++;
    },1000)
    //生成随机数组
    ceilRandArr  = game.math.shuffleArray(game.math.numberArray(0,ceilNum));
    ceilRandArr  = [0,1,2,3,4,5,7,6,8];
    ceilGroup = game.add.group();
    game.stage.backgroundColor = '#fff';

    for (var i = 0; i < colNum; i++)
    {
        for(var j = 0; j < rowNum; j++){
            //最后一格是空白图
            if(ceilRandArr[itemNum] != ceilNum){
                item = ceilGroup.create(j * width, i * height, 'item',ceilRandArr[itemNum]);
            }else{
                item = ceilGroup.create(j * width, i * height, 'item',ceilRandArr[itemNum],false);
                blankArrIndex  = itemNum;
            }
            item.myOrderIndex = ceilRandArr[itemNum];
            item.myArrIndex = itemNum;
            item.myX = i;
            item.myY = j;
            itemNum++;
        }
    }

    //game.add.sprite(120, 735, 'small');
    getCanMoveItem();
}

//获取能移动的格子
function getCanMoveItem(){
    var blankItem = ceilGroup.getAt(blankArrIndex);
    var aArounds   = getAreaPoint(blankItem.myX,blankItem.myY);
    ceilGroup.forEach(function(item) {
        item.inputEnabled = false;
        for(var i=0;i<aArounds.length;i++){
            if(item.myX == aArounds[i]['x']&&item.myY == aArounds[i]['y'] ){
                item.inputEnabled = true;
                item.input.enableDrag();
                item.input.enableSnap(width, height, true, false);
                //矫正移动位置
                item.events.onDragStop.add(fixLocation);
            }
        }
    });
}

function render() {
   game.debug.text('步数'+stepNum, 10, 20);
   game.debug.text('时间'+seconds, 10, 40);
}

function update() {

}

function fixLocation(item) {
    var blankItem = ceilGroup.getAt(blankArrIndex);

    if(item.x!=blankItem.x&&item.y!=blankItem.y){
        item.y = item.myX * height;
        item.x = item.myY * width;
    }else{
        stepNum++;
        var blankItemInfo = {
            'myX':blankItem.myX,
            'myY':blankItem.myY,
            'myArrIndex':blankItem.myArrIndex
        }
        var curItemInfo = {
            'myX':item.myX,
            'myY':item.myY,
            'myArrIndex':item.myArrIndex
        }
        //交换坐标 及left top值
        item.myArrIndex = blankItemInfo.myArrIndex;
        blankItem.myArrIndex = curItemInfo.myArrIndex;
        item.myX = blankItemInfo.myX;
        blankItem.myX = curItemInfo.myX;
        item.myY = blankItemInfo.myY;
        blankItem.myY = curItemInfo.myY;
        item.y = item.myX * height;
        blankItem.y = blankItem.myX * height;
        item.x = item.myY * width;
        blankItem.x = blankItem.myY * width;
        //console.log(tmpBlankArrIndex,item.myArrIndex);
        ceilRandArr[blankItem.myArrIndex] = blankItem.myOrderIndex;
        ceilRandArr[item.myArrIndex] = item.myOrderIndex;
        //console.log(ceilRandArr);
        getCanMoveItem();
    }

    var flag = true;
    for(var i=0;i<=ceilNum;i++){
        if(ceilRandArr[i]!=i){
            flag = false;
        }
    }
    if(flag){
        ceilGroup.create(blankItem.myY * width, blankItem.myX * height, 'item',ceilNum);
        ceilGroup.forEach(function(item) {
            item.inputEnabled = false;
        });
        alert('好棒，你成功啦，奖励!');
    }
}

//获取周围4个能移动区域坐标
function  getAreaPoint(x,y){
    var aArounds = [];
    aArounds.push({'x':x,'y':y+1});
    aArounds.push({'x':x,'y':y-1});
    aArounds.push({'x':x-1,'y':y});
    aArounds.push({'x':x+1,'y':y});
    return aArounds;
}


function viewPic(){
    //alert('查看');
    if(view){
        view.destroy();
        view = false;
    }else{
        view = game.add.sprite(0, 0, 'small');
    }


}

