// pages/test/test.js

Page({
  fraction(molecule,denominator){
    var o={};
    o.molecule=molecule;
    o.denominator=denominator;
    o.toFraction= function(){
      var value="";
      if(this.molecule==0)
      value="0";
      else if(this.denominator==1){
        value+=this.molecule;
      }
      else {
        value=this.molecule+'/'+this.denominator;
      }
      return value;
    };
    o.toNumber=function(){
      return Number((this.molecule/this.denominator).toString()).toFixed(4);
    };
    o.selfsimplification=function(){
    var x1=this.molecule;
    if(x1<0)x1=-x1;
    var y1=this.denominator;
    if(x1==0){
      this.molecule=0;
      this.denominator=1;
      return ;
    }else{
      var d=1;
      for(var i=1;i<=x1&&i<=y1;i++){
        if(x1%i==0&&y1%i==0){
          d=i;
        }
      }
      this.molecule=this.molecule/d;
      this.denominator=this.denominator/d;
      return ;
      }
    };

    return o;
  },
  
  plus(first,second){
    var x1=first.molecule;
    var y1=first.denominator;
    var x2=second.molecule;
    var y2=second.denominator;
    var y3=y1*y2;
    var x3=x1*y2+x2*y1;
    var answer=this.fraction(x3,y3);
    answer.selfsimplification();
    return answer;
  },
  minus(first,second){
    var x1=first.molecule;
    var y1=first.denominator;
    var x2=second.molecule;
    var y2=second.denominator;
    var y3=y1*y2;
    var x3=x1*y2-x2*y1;
    var answer=this.fraction(x3,y3);
    answer.selfsimplification();
    return answer;
  },
  times(first,second){
    var x1=first.molecule;
    var y1=first.denominator;
    var x2=second.molecule;
    var y2=second.denominator;
    var y3=y1*y2;
    var x3=x1*x2;
    var answer=this.fraction(x3,y3);
    answer.selfsimplification();
    return answer;
  },
  div(first,second){
    var x1=first.molecule;
    var y1=first.denominator;
    var x2=second.molecule;
    var y2=second.denominator;
    if(x2!=0){
      var y3=y1*x2;
      var x3=x1*y2;
      var answer=this.fraction(x3,y3);
      answer.selfsimplification();
      return answer;
    }
  },

  Mat(index,name,x,y,show,value,txt){
    this.index=index;
    this.name=name;
    this.x=x;
    this.y=y;
    this.show=show;
    this.value=value;
    this.txt=txt;
  },

  tableToTxt(table){
    var y=table.length;
    var x=table[0].length;
    var value='';
    for(var j=0;j<y;j++){
      for(var z=0;z<x;z++){
        if(this.data.showtype==0)
          value+=table[j][z].toFraction();
        else
        value+=table[j][z].toNumber();
        if(z!=x-1)value+=" ";
      }
      if(j!=y-1)value+='\n';
    }
    return value;
  },
  txtToFraction1(txt){
    var elements=txt.split('/');
    var molecule=elements[0];
    var denominator=elements[1];
    var fraction=new this.fraction(molecule,denominator);
    fraction.selfsimplification();
    return fraction;
  },
  txtToFraction2(txt){
    var elements=txt.split('.');
    var integer=elements[0];
    var decimal=elements[1];
    var molecule=parseInt(integer+decimal);
    var denominator=1;
    if(decimal.length>=1){
      for(var i=0 ;i<decimal.length;i++)denominator*=10;
    }
    var fraction=new this.fraction(molecule,denominator);
    fraction.selfsimplification();
    return fraction;
  },
  txtToFraction3(txt){
    var molecule=parseInt(txt);
    var denominator=1;
    var fraction=new this.fraction(molecule,denominator);
    fraction.selfsimplification();
    return fraction;
  },
  exchange(txt){
    if(txt!=""){
      var lines=txt.split('\n');
      var table=[];
      var y=lines.length;
      var x=0;
      for(var i=0;i<y;i++){
        lines[i] = lines[i].split(' ');
        if(x<lines[i].length)x=lines[i].length;
      }
      for(var i=0;i<y;i++){
        var fractionline=[];
        for(var j=0;j<x;j++){
          var num=lines[i][j];
          var f;
          if(num.indexOf("/")!=-1){f=this.txtToFraction1(num);}
          else if(num.indexOf(".")!=-1){f=this.txtToFraction2(num);}
          else {f=this.txtToFraction3(num);}
          fractionline.push(f);
        }
        table.push(fractionline);
      }
      var newtxt=this.tableToTxt(table);
      return newtxt;
    }
   return "";
  },
  getzeroNum(table){
    var zeronum=[];
    var y=table.length;
    var x=table[0].length;
    for(var i=0;i<y;i++){
      var num=0;
      for(var j=0;j<x;j++){
        if(table[i][j].molecule==0)num++;
        else break;
      }
      zeronum.push(num);
    }
    return zeronum;
  },
  sublines(tableAndZero,n){
    var number=0;
    var table=tableAndZero[0];
    var x=table[0].length;
    var zeronum=tableAndZero[1];
    var thezeronum=zeronum[n];
    while(thezeronum!=x&&thezeronum==zeronum[n+number+1]){
      var firstline=table[n];
      var secondline=table[n+number+1];
      var times=this.div(secondline[thezeronum],firstline[thezeronum]);
      for(var i=thezeronum;i<x;i++){
        secondline[i]=this.minus(secondline[i],this.times(times,firstline[i]));
      }
      table[n+number+1]=secondline;
      number++;
    }
    var newzero=this.getzeroNum(table);
    return [table,newzero];
  },
  sublinesAll1(tableall,n){
    var number=0;
    var table1=tableall[0];
    var table2=tableall[1];
    var x1=table1[0].length;
    var x2=table2[0].length;
    var zeronum=tableall[2];
    var thezeronum=zeronum[n];
    while(thezeronum!=x1&&thezeronum==zeronum[n+number+1]){
      var firstline=table1[n];
      var firstline2=table2[n];
      var secondline=table1[n+number+1];
      var secondline2=table2[n+number+1];
      var times=this.div(secondline[thezeronum],firstline[thezeronum]);
      for(var i=thezeronum;i<x1;i++){
        secondline[i]=this.minus(secondline[i],this.times(times,firstline[i]));
      }
      for(var i=0;i<x2;i++){
        secondline2[i]=this.minus(secondline2[i],this.times(times,firstline2[i]));
      }
      table1[n+number+1]=secondline;
      table2[n+number+1]=secondline2;
      number++;
    }
    var newzero=this.getzeroNum(table1);
    return [table1,table2,newzero];
  },
  sublinesAll2(tableall,n){
    var table1=tableall[0];
    var table2=tableall[1];
    var x1=table1[0].length;
    var x2=table2[0].length;
    var zeronum=tableall[2];
    var thezeronum=zeronum[n];
    var m=n-1;
    while(m>=0){
      var firstline=table1[n];
      var firstline2=table2[n];
      var secondline=table1[m];
      var secondline2=table2[m];
      var times=this.div(secondline[thezeronum],firstline[thezeronum]);
      for(var i=thezeronum;i<x1;i++){
        secondline[i]=this.minus(secondline[i],this.times(times,firstline[i]));
      }
      for(var i=0;i<x2;i++){
        secondline2[i]=this.minus(secondline2[i],this.times(times,firstline2[i]));
      }
      table1[m]=secondline;
      table2[m]=secondline2;
      m--;
    }
    var newzero=this.getzeroNum(table1);
    return [table1,table2,newzero];
  },
  divself(tableall,n){
    var table1=tableall[0];
    var table2=tableall[1];
    var x1=table1[0].length;
    var x2=table2[0].length;
    var zeronum=tableall[2];
    var thezeronum=zeronum[n];
    var line1=table1[n];
    var line2=table2[n];
    for(var i=0;i<x2;i++){
      line2[i]=this.div(line2[i],line1[thezeronum]);
    }
    for(var i=x1-1;i>=thezeronum;i--){
      line1[i]=this.div(line1[i],line1[thezeronum]);
    }
    table1[n]=line1;
    table2[n]=line2;
    return [table1,table2,zeronum];
  },
  sort2(tableAndZero){
    var table=tableAndZero[0];
    var zeronum=tableAndZero[1];
    var y=table.length;
    for(var i=0;i<y-1;i++){
      for(var j=0;j<y-i-1;j++){
        if(zeronum[j]>zeronum[j+1]){
          var temp=zeronum[j];
          zeronum[j]=zeronum[j+1];
          zeronum[j+1]=temp;
          var t=table[j];
          table[j]=table[j+1];
          table[j+1]=t;
        }
      }
    }
    return [table,zeronum];
  },
  sort3(tableall){
    var table1=tableall[0];
    var table2=tableall[1];
    var zeronum=tableall[2];
    var r=table1.length;
    for(var i=0;i<r-1;i++){
      for(var j=0;j<r-i-1;j++){
        if(zeronum[j]>zeronum[j+1]){
          var temp=zeronum[j];
          zeronum[j]=zeronum[j+1];
          zeronum[j+1]=temp;
          var t1=table1[j];
          table1[j]=table1[j+1];
          table1[j+1]=t1;
          var t2=table2[j];
          table2[j]=table2[j+1];
          table2[j+1]=t2;
        }
      }
    }
    return [table1,table2,zeronum];
  },
  sort4(tableAndZeroAndN){
    var table=tableAndZeroAndN[0];
    var zeronum=tableAndZeroAndN[1];
    var n=tableAndZeroAndN[2];
    var y=table.length;
    for(var i=0;i<y-1;i++){
      for(var j=0;j<y-i-1;j++){
        if(zeronum[j]>zeronum[j+1]){
          var temp=zeronum[j];
          zeronum[j]=zeronum[j+1];
          zeronum[j+1]=temp;
          var t=table[j];
          table[j]=table[j+1];
          table[j+1]=t;
          n++;
        }
      }
    }
    return [table,zeronum,n];
  },
  data: {
    MatList:[],
    number:0,
    showadd:false,
    showmultplyNumber:false,
    showmultplyMat:false,
    showmatsadd:false,
    showedit:false,
    showanswer:false,
    showorder:false,
    showdet:false,
    inputVal:'',
    inputName:'',
    editIndex:1,
    editVal:'',
    editName:'',
    tempName:'',
    tempTxt:'',
    tempValue:'',
    theOrder:"",
    theDet:"",
    selector1:"",
    selectindex1:"",
    getnumber1:'',
    selector2:"",
    selectindex2:"",
    getnumber2:'',
    showtype:1,
  },
  findaccompany(e){
    var index=e.currentTarget.dataset.index;
    var list=this.data.MatList;
    var i=0;
    for(i=0;i<list.length;i++){
      if(index==list[i].index){
        break;
      }
    }
    var table1=list[i].value;
    var name="Accompany "+list[i].name;
    var table=JSON.parse(JSON.stringify(table1));
    var y=table.length;
    var tableList=[];
    for(var i=0;i<y;i++){
      var smalltableline=[];
      for(var j=0;j<y;j++){
        var smalltable=[];
        for(var z=0;z<y;z++){
          if(z!=i){
            var smallnumberline=[];
            for(var l=0;l<y;l++){
              if(l!=j){
                var smallnumber=table[z][l];
                smallnumberline.push(smallnumber)
              };
            }
            smalltable.push(smallnumberline);
          }
        }
        smalltableline.push(smalltable);
      }
      tableList.push(smalltableline);
    }
    var answer=[];
    var O=this.fraction(0,1);
    for(var i=0;i<y;i++){
      var answerline=[];
      for(var j=0;j<y;j++){
        if((i+j)%2==0){
          answerline.push(this.plus(O,this.becomedet(tableList[j][i])));
        }else{
          answerline.push(this.minus(O,this.becomedet(tableList[j][i])));
        }
      }
      answer.push(answerline);
    }
    var txt=this.tableToTxt(answer);
    this.setData({
      tempName:name,
      tempTxt:txt,
      tempValue:answer,
      showanswer:true
    })
  },
  findInverse(e){
    var index=e.currentTarget.dataset.index;
    var list=this.data.MatList;
    var i=0;
    for(i=0;i<list.length;i++){
      if(index==list[i].index){
        break;
      }
    }
    var table1=list[i].value;
    var name="Inverse "+list[i].name;
    var table=JSON.parse(JSON.stringify(table1));
    var y=table.length;
    var x=table[0].length;
    var tableE=[];
    var O=this.fraction(0,1);
    var I=this.fraction(1,1);
    for(var i=0;i<y;i++){
      var lineE=[];
      for(var j=0;j<y;j++){
        if(i!=j)lineE.push(O);
        else lineE.push(I);
      }
      tableE.push(lineE);
    }
    var zeronum=this.getzeroNum(table1);
    var tableall=[table,tableE,zeronum];
    for(var i=0;i<y-1;i++){
      tableall=this.sort3(tableall);
      tableall=this.sublinesAll1(tableall,i);
    }
    if(tableall[2][y-1]==x){
      wx.showToast({
        title: '行列式为0，臣妾做不到啊',
        duration: 1000,
        icon:"none"
      });
      return;
    }else{
      for(var i=1;i<y;i++){
        tableall=this.sublinesAll2(tableall,i);
      }
      for(var i=0;i<y;i++){
        tableall=this.divself(tableall,i);
      }
    }
    var Inverse=tableall[1];
    var txt=this.tableToTxt(Inverse);
    this.setData({
      tempName:name,
      tempTxt:txt,
      tempValue:Inverse,
      showanswer:true
    })
  },
  finddet(e){
    var index=e.currentTarget.dataset.index;
    var list=this.data.MatList;
    var i=0;
    for(i=0;i<list.length;i++){
      if(index==list[i].index){
        break;
      }
    }
    var table1=list[i].value;
    var table=JSON.parse(JSON.stringify(table1));
    var y=table.length;
    var zeronum=this.getzeroNum(table1);
    var tableAndZeroAndN=[table,zeronum,0];
    for(var j=0;j<y-1;j++){
      tableAndZeroAndN=this.sort4(tableAndZeroAndN);
      var temp2=tableAndZeroAndN[2];
      var temp01=this.sublines(tableAndZeroAndN,j);
      tableAndZeroAndN=[temp01[0],temp01[1],temp2];
    }
    var det=this.fraction(1,1);
    if(tableAndZeroAndN[2]%2==1){det=this.fraction(-1,1);}
    for(i=0;i<y;i++){
      det=this.times(det,table[i][i]);
    }
    det=det.toNumber();
    this.setData({
      theDet:det,
      showdet:true
    })
  },
  findOrder(e){
    var index=e.currentTarget.dataset.index;
    var list=this.data.MatList;
    var i=0;
    for(i=0;i<list.length;i++){
      if(index==list[i].index){
        break;
      }
    }
    var table1=list[i].value;
    var table=JSON.parse(JSON.stringify(table1));
    var y=table.length;
    var x=table[0].length;
    var zeronum=this.getzeroNum(table1);
    var tableAndZero=[table,zeronum];
    for(var j=0;j<y-1;j++){
      tableAndZero=this.sort2(tableAndZero);
      tableAndZero=this.sublines(tableAndZero,j);
    }
    var order=0;
    for(i=0;i<y;i++){
      if(tableAndZero[1][i]!=x)order++;
    }
    order=order.toString();
    this.setData({
      theOrder:order,
      showorder:true
    })
  },
  confirmOrder(){
    this.setData({
      theOrder:"",
      showorder:false
    })
  },
  confirmDet(){
    this.setData({
      theDet:"",
      showdet:false
    })
  },
  getnumberBlur1(e){
    var number=e.detail.value;
    this.setData({
      getnumber1:number
    })
  },
  getnumberBlur2(e){
    var number=e.detail.value;
    this.setData({
      getnumber2:number
    })
  },
  multplyNumberYes(){
    var list=this.data.MatList;
    var number=this.data.getnumber1;
    var i=this.data.selectindex1;
    if(number!=""&&i!=""){
      var Mat=list[i];
      var name="("+number+"×"+Mat.name+")";
      var num;
      if(number.indexOf("/")!=-1){num=this.txtToFraction1(number);}
      else if(number.indexOf(".")!=-1){num=this.txtToFraction2(number);}
      else {num=this.txtToFraction3(number);}
      var value=Mat.value;
      var newvalue=[];
      for(var i=0;i<value.length;i++){
        var newvalueline=[];
        for(var j=0;j<value[0].length;j++){
          newvalueline.push(this.times(value[i][j],num));
        }
        newvalue.push(newvalueline);
      }
      var txt=this.tableToTxt(newvalue);
      this.setData({
        tempName:name,
        tempTxt:txt,
        tempValue:newvalue,
        showmultplyNumber:false,
        showanswer:true,
        selector1:"",
        selectindex1:"",
        getnumber1:''
      })
    }else{
      wx.showToast({
        title: '数据不全',
        duration:1000,
        icon:"error"
      })
    } 
  },
  multplyMatYes(){
    var list=this.data.MatList;
    var i1=this.data.selectindex1;
    var Mat1=list[i1];
    var i2=this.data.selectindex2;
    var Mat2=list[i2];
    if(i1==""||i2==""){
      wx.showToast({
        title: '数据不全',
        duration: 1000,
        icon:"error"
      });
      return;
    }
    var name="("+Mat1.name+"×"+Mat2.name+")";
    var value1=Mat1.value;
    var value2=Mat2.value;
    var y1=value1.length;
    var y2=value2.length;
    var x1=value1[0].length;
    var x2=value2[0].length;
    if(x1!=y2){
      wx.showToast({
        title: '矩阵不匹配',
        duration: 1000,
        icon:"error"
      });
      return;
    }
    var newvalue=[];
    for(var i=0;i<y1;i++){
      var newvalueline=[];
      for(var j=0;j<x2;j++){
        var smallnumber=this.fraction(0,1);
        for(var z=0;z<x1;z++){
          smallnumber=this.plus(smallnumber,this.times(value1[i][z],value2[z][j]));
        }
        newvalueline.push(smallnumber);
      }
      newvalue.push(newvalueline);
    }
    console.log(newvalue);
    var txt=this.tableToTxt(newvalue);
    console.log(txt);
    this.setData({
      tempName:name,
      tempTxt:txt,
      tempValue:newvalue,
      showmultplyMat:false,
      showanswer:true,
      selector1:"",
      selectindex1:"",
      getnumber1:'',
      selector2:"",
      selectindex2:"",
      getnumber2:''
    })
  },
  MatsAddYes(){
    var num1=this.data.getnumber1;
    var num2=this.data.getnumber2;
    var list=this.data.MatList;
    var i1=this.data.selectindex1;
    var Mat1=list[i1];
    var i2=this.data.selectindex2;
    var Mat2=list[i2];
    if(i1==""||i2==""||num1==""||num2==""){
      wx.showToast({
        title: '数据不全',
        duration: 1000,
        icon:"error"
      });
      return;
    }
    var n1;
    if(num1.indexOf("/")!=-1){n1=this.txtToFraction1(num1);}
    else if(num1.indexOf(".")!=-1){n1=this.txtToFraction2(num1);}
    else {n1=this.txtToFraction3(num1);}
    var n2;
    if(num2.indexOf("/")!=-1){n2=this.txtToFraction1(num2);}
    else if(num2.indexOf(".")!=-1){n2=this.txtToFraction2(num2);}
    else {n2=this.txtToFraction3(num2);}
    if(num1=="1")num1="";
    else if(num1=="-1")num1="-";
    else num1+="×";
    if(num2=="1")num2="+";
    else if(num2=="-1")num2="-";
    else if(num2[0]!='-')num2="+"+num2+"×";
    var name="("+num1+Mat1.name+num2+Mat2.name+")";
    var value1=Mat1.value;
    var value2=Mat2.value;
    var y1=value1.length;
    var y2=value2.length;
    var x1=value1[0].length;
    var x2=value2[0].length;
    if(x1!=x2&&y1!=y2){
      wx.showToast({
        title: '矩阵不匹配',
        duration: 1000,
        icon:"error"
      });
      return;
    }
    var newvalue=[];


    for(var i=0;i<y1;i++){
      var newvalueline=[];
      for(var j=0;j<x2;j++){
        var smallnumber=this.plus(this.times(n1,value1[i][j]),this.times(n2,value2[i][j]));
        newvalueline.push(smallnumber);
      }
      newvalue.push(newvalueline);
    }
    var txt=this.tableToTxt(newvalue);
    this.setData({
      tempName:name,
      tempTxt:txt,
      tempValue:newvalue,
      showmatsadd:false,
      showanswer:true,
      selector1:"",
      selectindex1:"",
      getnumber1:'',
      selector2:"",
      selectindex2:"",
      getnumber2:''
    })
  },
  multplyNumberNo(){
    this.setData({
      showmultplyNumber:false,
      selector1:"",
      selectindex1:"",
      getnumber1:''
    })
  },
  multplyMatNo(){
    this.setData({
      showmultplyMat:false,
      selector1:"",
      selectindex1:"",
      getnumber1:'',
      selector2:"",
      selectindex2:"",
      getnumber2:''
    })
  },
  MatsAddNo(){
    this.setData({
      showmatsadd:false,
      selector1:"",
      selectindex1:"",
      getnumber1:'',
      selector2:"",
      selectindex2:"",
      getnumber2:''
    })
  },
  No(){
    this.setData({
      showanswer:false,
      tempName:'',
      tempTxt:'',
      tempValue:''
    })
  },
  Yes(){
    var list=this.data.MatList;
    var number=this.data.number+1;
    var txt=this.data.tempTxt;
    var value=this.data.tempValue;
    var name=this.data.tempName;
    var index=list[list.length-1].index+1;
    var y=value.length;
    var x=value[0].length;
    var newMat=new this.Mat(index,name,x,y,false,value,txt);
    list.push(newMat);
    this.setData({
      MatList:list,
      number:number,
      showanswer:false,
      tempName:'',
      tempTxt:'',
      tempValue:''
    })
  },
  turn(e){
    var index=e.currentTarget.dataset.index;
    var list=this.data.MatList;
    var i=0;
    for(i=0;i<list.length;i++){
      if(list[i].index==index){
        break;
      }
    }
    var frontMat=list[i];
    var name="Turn "+frontMat.name;
    var x=frontMat.y;
    var y=frontMat.x;
    var newtable=[];
    for(var j=0;j<y;j++){
      newtable.push([]);
      for(var k=0;k<x;k++){
        newtable[j].push(frontMat.value[k][j]);
      }
    }
    var txt=this.tableToTxt(newtable);
    this.setData({
      tempName:name,
      tempTxt:txt,
      tempValue:newtable,
      showanswer:true
    })
  },
  edit(e){
    var index=e.currentTarget.dataset.index;
    var list=this.data.MatList;
    var i=0;
    for(i=0;i<list.length;i++){
      if(list[i].index==index){
        break;
      }
    }
    var Mat=list[i];
    var index=Mat.index;
    var txt=Mat.txt;
    var name=Mat.name;
    this.setData({
      editIndex:index,
      editVal:txt,
      editName:name,
      showedit:true
    })
  },
  showMat(e){
    var index=e.currentTarget.dataset.index;
    var list=this.data.MatList;
    var i=0;
    for(i=0;i<list.length;i++){
      if(list[i].index==index){
        break;
      }
    }
    if(list[i].show==true)
      list[i].show=false;
    else if(list[i].show==false)
      list[i].show=true;
    this.setData({
      MatList:list
    })
  },
  build(n,txt,name){
    var lines=txt.split('\n');
    var table=[];
    var y=lines.length;
    var x=0;
    for(var i=0;i<y;i++){
      lines[i] = lines[i].split(' ');
      if(x<lines[i].length)x=lines[i].length;
    }
    for(var i=0;i<y;i++){
      var fractionline=[];
      for(var j=0;j<x;j++){
        var num=lines[i][j];
        var f;
        if(num.indexOf("/")!=-1){f=this.txtToFraction1(num);}
        else if(num.indexOf(".")!=-1){f=this.txtToFraction2(num);}
        else {f=this.txtToFraction3(num);}
        fractionline.push(f);
      }
      table.push(fractionline);
    }
    var newMat=new this.Mat(n,name,x,y,false,table,txt);
    return newMat;
  },
  add(){
    var list=this.data.MatList;
    if(list.length!=0)
    var name="Mat"+(list[list.length-1].index+1);
    else var name="Mat1";
    this.setData({
      showadd: true,
      inputName:name
    })
  },
  bindTextAreaBlurAdd(e){
    var value=e.detail.value;
    this.setData({
      inputVal:value
    })
  },
  del(e){
    var list=this.data.MatList;
    var number=this.data.number-1;
    var index=e.currentTarget.dataset.index;
    for(var i=0;i<list.length;i++){
      if(list[i].index==index){
        list.splice(i, 1);
        break;
      }
    }
    this.setData({
      MatList:list,
      number:number
    })
  },
  bindTextAreaBlurEdit(e){
    var value=e.detail.value;
    this.setData({
      editVal:value
    })
  },
  bindInputBlurAdd(e){
    var value=e.detail.value;
    this.setData({
      inputName:value
    })
  },
  bindInputBlurEdit(e){
    var value=e.detail.value;
    this.setData({
      editName:value
    })
  },
  subAdd(e) {

      wx.showToast({
        title: '添加成功',
        duration: 1000
      }),
      this.setData({
        showadd: false,
      })
    

  },
  subAddCancel(e) {
    this.setData({
      showadd: false,
      inputVal:'',
      inputName:'',
    })
  },
  subEdit(e) {
    wx.showToast({
      title: '修改成功',
      duration: 1000
    }),
    this.setData({
      showedit: false,
    })
  },
  subEditCancel(e){
    this.setData({
      showedit: false,
      editVal:'',
      editName:'',
    })
  },
  bindFormSubmitAdd(){
    var that=this;
    var txt=that.data.inputVal;
    var name=that.data.inputName;
    if(name!=""&&txt!=""){
      var list=this.data.MatList;
      if(list.length!=0)
      var n=list[list.length-1].index+1;
      else var n=1;
      var Mat=this.build(n,txt,name);
      Mat.txt=this.tableToTxt(Mat.value);
      list.push(Mat);
      that.setData({
        number:n,
        MatList:list,
        inputVal:'',
        inputName:'',
      })
    }else{
      wx.showToast({
        title: '添加失败',
        duration: 1000,
        icon:"error"
      });
    }
  },
  bindFormSubmitEdit(){
    var that=this;
    var txt=that.data.editVal;
    var name=that.data.editName;
    if(name!=""&&txt!=""){
      var index=that.data.editIndex;
      var Mat=this.build(index,txt,name);
      var list=this.data.MatList;
      for(var i=0;i<list.length;i++){
        if(list[i].index==index){
          list[i]=Mat;
        }
      }
      that.setData({
        MatList:list,
        editName:'',
        editVal:'',
      })
    }else{
      wx.showToast({
        title: '修改失败',
        duration: 1000,
        icon:"error"
      });
    }
   
  },
  multplyNumber(e){
    this.setData({
      showmultplyNumber:true
    })
  },
  multplyMat(e){
    this.setData({
      showmultplyMat:true
    })
  },
  Matsadd(e){
    this.setData({
      showmatsadd:true
    })
  },
  selectorChange1: function (e) {
    let i = e.detail.value;
    let value;
    if(this.data.MatList.length!=0){
      value = this.data.MatList[i].name;
      this.setData({
        selector1:value,
        selectindex1:i
      });
    }
  },
  selectorChange2: function (e) {
    let i = e.detail.value;
    let value = this.data.MatList[i].name;
    this.setData({
      selector2:value,
      selectindex2:i
    });
  },
  becomedet(table1){
    var table=JSON.parse(JSON.stringify(table1));
    var y=table.length;
    if(y==1){
      return table1[0][0];
    }
    var zeronum=this.getzeroNum(table1);
    var tableAndZeroAndN=[table,zeronum,0];
    for(var j=0;j<y-1;j++){
      tableAndZeroAndN=this.sort4(tableAndZeroAndN);
      var temp2=tableAndZeroAndN[2];
      var temp01=this.sublines(tableAndZeroAndN,j);
      tableAndZeroAndN=[temp01[0],temp01[1],temp2];
    }
    var det=this.fraction(1,1);
    if(tableAndZeroAndN[2]%2==1){det=this.fraction(-1,1);;}
    for(var i=0;i<y;i++){
      det=this.times(det,table[i][i]);
    }

    return det;
  },
  typechange(){
    var type=this.data.showtype;
    var newtype=1-type;
    this.setData({
      showtype:newtype
    })
    var editVal=this.data.editVal;
    var tempTxt=this.data.tempTxt;
    var list=this.data.MatList;
    var det=this.data.theDet;
    var order=this.data.theOrder;
    editVal=this.exchange(editVal);
    tempTxt=this.exchange(tempTxt);
    for(var i=0;i<list.length;i++){
      list[i].txt=this.exchange(list[i].txt);
    }
    det=this.exchange(det);
    order=this.exchange(order);
    this.setData({
      editVal:editVal,
      tempTxt:tempTxt,
      MatList:list,
      theDet:det,
      theOrder:order
    })
  },
  click(e){
     //console.log(this.data.tempTxt);

  },
  onLoad: function (options) {
  },
  onReady: function () {
  },
  onShow: function () {
  },
  onHide: function () {
  },
  onUnload: function () {
  },
  onPullDownRefresh: function () {
  },
  onReachBottom: function () {
  },
  onShareAppMessage: function () {
  },
})