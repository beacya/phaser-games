
var game = new Phaser.Game(500, 500, Phaser.AUTO, '2048', { preload: preload, create: create ,update:update});

var numData = new Array();
var numbersGroup;
var MoveFlag = true;
//预加载
function preload() {
    game.load.image('n-2', './svg2/2.svg');
    game.load.image('n-4', './svg2/4.svg');
    game.load.image('n-8', './svg2/8.svg');
    game.load.image('n-16', './svg2/16.svg');
    game.load.image('n-32', './svg2/32.svg');

}

//创建游戏
function create() {
    //游戏背景色
    game.stage.backgroundColor = '#bbada0';
    //定义背景格子
    var bmd = game.add.bitmapData(100,100);
    var cellGroup = game.add.group();
    numbersGroup = game.add.group();
    bmd.ctx.beginPath();
    bmd.ctx.rect(0,0,100,100);
    bmd.ctx.fillStyle = '#cdc1b3';
    bmd.ctx.fill();
    //生成4*4背景格子
    for (var i = 0; i < 4; i++)
    {
        numData[i] = new Array();
        for(var j = 0; j < 4; j++){
           cellGroup.create(j * 120 + 20, i * 120 + 20, bmd);
            numData[i][j] = {'myNum':0,'myItem':''};
        }
    }

    randNum();
    randNum();

}


//生成随机数
function update() {


    if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)&&MoveFlag)
    {
        //moveLeft
        MoveFlag = false;
        setTimeout("MoveFlag = true",300);
        moveLeft();
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)&&MoveFlag)
    {
        //moveRight
        MoveFlag = false;
        setTimeout("MoveFlag = true",300);
        moveRight();

    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.UP))
    {
        //moveUp
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN))
    {
        //moveDown
    }

}

//生成随机数
function randNum(){
    var i = Math.floor(Math.random() * (4 - 0)) + 0;
    var j = Math.floor(Math.random() * (4 - 0)) + 0;
    if(numData[i][j]['myNum']==0){
        var item = game.add.sprite(j * 120 + 10, i * 120 + 10, 'n-2');
        numData[i][j]['myNum'] = 2;
        numData[i][j]['myItem'] = item;
        console.log('random:'+i+','+j);
    }else{
        randNum();
    }
}

function moveLeft(){
    //是否合并过数组
    var flag = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
    if(canMoveLeft()){
        for(var i=0;i<4;i++){
            for(var j=1;j<4;j++){
                if( numData[i][j]['myNum'] != 0 ){
                    var item = numData[i][j]['myItem'];
                    for(var k=0;k<j;k++){
                        if(numData[i][k]['myNum'] == 0 && noBlockHorizontal(i,k,j) ){
                            //console.log(i+','+k+"num"+numData[i][k]['myNum']+"from-l"+i+','+j+"num"+numData[i][j]['myNum']);
                            numData[i][k] = numData[i][j];
                            numData[i][j] = {'myNum':0,'myItem':''};;
                            game.add.tween(item).to({ x: k * 120 + 10,y:i * 120 + 10 }, 10,Phaser.Easing.Linear.None, true);
                            break;
                        }else if(numData[i][k]['myNum'] == numData[i][j]['myNum'] && noBlockHorizontal(i,k,j)&&flag[i][k]!=1){
                            var itemK = game.add.sprite(k * 120 + 10, i * 120 + 10, 'n-'+numData[i][j]['myNum'] * 2);
                            //console.log(i+','+k+"num"+numData[i][k]['myNum']+"merge-l"+i+','+j+"num"+numData[i][j]['myNum']);
                            item.destroy();
                            numData[i][k]['myItem'].destroy();
                            numData[i][k] = {'myNum':numData[i][j]['myNum'] * 2,'myItem':itemK};
                            numData[i][j] = {'myNum':0,'myItem':''};
                            flag[i][k]=1;
                            break;
                        }
                    }
                }
            }
        }

        setTimeout("randNum();console.log(numData);console.log('l');",50);

    }

}

function canMoveLeft(){
    for(var i=0;i<4;i++){
        for(var j=1;j<4;j++){
            if( numData[i][j]['myNum'] != 0 ){
                if(numData[i][(j - 1)]['myNum']==0 || numData[i][(j - 1)]['myNum'] == numData[i][j]['myNum']){
                    return true;
                }
            }
        }
    }
    return false;
}

function moveRight(){
    //是否合并过数组
    var flag = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
    if(canMoveRight()){
        for(var i=0;i<4;i++){
            for(var j=2;j>=0;j--){
                if( numData[i][j]['myNum'] != 0 ){
                    var item = numData[i][j]['myItem'];
                    for(var k=3;k>j;k--){
                        if(numData[i][k]['myNum'] == 0 && noBlockHorizontal(i,k,j) ){
                            //console.log(i+','+k+"num"+numData[i][k]['myNum']+"from-r"+i+','+j+"num"+numData[i][j]['myNum']);
                            numData[i][k] = numData[i][j];
                            numData[i][j] = {'myNum':0,'myItem':''};
                            game.add.tween(item).to({ x: k * 120 + 10,y:i * 120 + 10 }, 10, Phaser.Easing.Linear.None, true);
                            break;
                        }else if(numData[i][k]['myNum'] == numData[i][j]['myNum'] && noBlockHorizontal(i,k,j)&&flag[i][k]!=1){
                            var itemK = game.add.sprite(k * 120 + 10, i * 120 + 10, 'n-'+numData[i][j]['myNum'] * 2);
                            //console.log(i+','+k+"num"+numData[i][k]['myNum']+"merge-r"+i+','+j+"num"+numData[i][j]['myNum']);
                            item.destroy();
                            numData[i][k]['myItem'].destroy();
                            numData[i][k] = {'myNum':numData[i][j]['myNum'] * 2,'myItem':itemK};
                            numData[i][j] = {'myNum':0,'myItem':''};
                            flag[i][k]=1;
                            break;
                        }
                    }
                }
            }
        }
        setTimeout("randNum();console.log(numData);console.log('r');",50);
    }

}

function canMoveRight(){
    for(var i=0;i<4;i++){
        for(var j=2;j>=0;j--){
            if( numData[i][j]['myNum'] != 0 ){
                if(numData[i][(j + 1)]['myNum']==0 || numData[i][(j + 1)]['myNum'] == numData[i][j]['myNum']){
                    return true;
                }
            }
        }
    }
    return false;
}

function noBlockHorizontal(i,k,j){
    for(var y=k+1;y<j;y++){
        if(numData[i][y]['myNum'] !=0 ){
            return false;
        }
    }
    return true;
}

