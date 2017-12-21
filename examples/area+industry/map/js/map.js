class MapInfo {
    static initComponent() {
        let AreaDetail = Vue.component('areaDetail', {
            template: `<div class='area-detail'>
                <div class='item province' 
                 :class="checkedProvince&&'checked'" @click='initChecked("province")' 
                 :title="provinceName"><span>{{provinceName}}</span></div>
                <div class='item city' :class="checkedCity&&'checked'" 
                 @click='initChecked("city")' v-show="cityId!=null"
                 :title="cityName"><span>{{cityId==-1?'请选择':cityName}}</span></div>                
                <div class='item area' :class="checkedArea&&'checked'"
                 @click='initChecked("area")' v-show="areaId!=null"
                 :title="areaName"><span>{{areaId==-1?'请选择':areaName}}</span></div>                
            </div>`,
            data() {
                return {
                    checkedProvince: false,
                    checkedCity: false,
                    checkedArea: false,
                    provinceId: '430000',
                    provinceName: '湖南省',
                    cityId: '430100',
                    cityName: '长沙市',
                    areaId: '',
                    areaName: ''
                }
            },
            methods: {
                setData(ptab, name, id) {
                    switch (ptab) {
                        case "province":
                            this.provinceId = id;
                            this.provinceName = name;
                            this.initChecked('city');
                            this.cityId = -1;     
                            break;
                        case "city":
                            this.cityId = id;
                            this.cityName = name;
                            this.initChecked('area');
                            this.areaId = -1;
                            break;
                        case "area":
                            this.areaId = id;
                            this.areaName = name;
                            break;
                    }
                    let data = {
                        provinceId: this.provinceId,
                        provinceName: this.provinceName,
                        cityId: this.cityId,
                        cityName: this.cityName,
                        areaId: this.areaId,
                        areaName: this.areaName
                    };
                    this.$emit('callResult', data)
                },
                initChecked(tab) {
                    this.checkedProvince = false;
                    this.checkedCity = false;
                    this.checkedArea = false;
                    switch (tab) {
                        case 'province':
                            this.checkedProvince = true;
                            this.areaId = -1;
                            this.$emit('changeArea', 'province', '86', this.provinceId);
                            break;
                        case 'city':
                            this.checkedCity = true;
                            this.areaId = -1;          
                            this.$emit('changeArea', 'city', this.provinceId, this.cityId);
                            break;
                        case 'area':
                            this.checkedArea = true;
                            this.$emit('changeArea', 'area', this.cityId, this.areaId);
                            break;
                        default:
                            break;
                    }
                }
            }
        });
        Vue.component('areaPanle', {
            template: `<div class='area-panle'>
            <div>
            <ul>
            <li v-for="(item,index) in areaList" :key="index" @click="choiseInfo(item,index)">
            <span class="area-panel-info"
             :class="index==currentId?'checked':''" 
             :title="item">{{item}}</span>
            </li>
            </ul>
            </div>
            </div>`,
            props: ['areaList'],
            data() {
                return {
                    currentId: null
                }
            },
            methods: {
                choiseInfo(item, index) {
                    this.currentId = index;
                    console.log(item, index);
                    this.$emit('choiseInfo', item, index);
                },
                //设置当前选中的项Id
                setCurrentId(_currentId) {
                    this.currentId = _currentId;
                }
            }
        });
        Vue.component('industryPanle', {
            template: `<div class='industry-panle'>
            <div class='main-industry'>
                <ul>
                <li v-for="(item,index) in mainIndustryList" :key="index" @click="getChild(item)"  :class="item.id==currentMainId?'checked':''" >
                <span class="item area-panel-info"
               
                :title="item.name">{{item.name}}</span>
                <span class="icon">{{'>'}}</span>
                </li>
                </ul>
            </div>
            <div class='child-industry'>
            <ul>
            <li v-for="(item,index) in childIndustryList" :key="index"  @click="checkedIndustry(item)">
            <span class="area-panel-info"
             :class="item.id==currentChildId?'checked':''" 
             :title="item.name">{{item.name}}</span>
            </li>
            </ul> </div>                                   
            </div>`,
            data() {
                return {
                    mainIndustryList: [],
                    childIndustryList: [],
                    currentMainName: null,
                    currentMainId: null,
                    currentChildId: null
                }
            },
            methods: {
                getChild(item) {
                    this.currentMainId = item.id;
                    this.currentMainName = item.name;
                    this.childIndustryList = item.subIndustrys;
                    this.$emit('industryResult', {
                        pid: this.currentMainId,
                        childIds: this.currentChildId,
                        name: this.currentMainName
                    })
                },
                checkedIndustry(item) {
                    this.currentChildId = item.id;
                    this.$emit('industryResult', {
                        pid: this.currentMainId,
                        childIds: this.currentChildId,
                        name: this.currentMainName
                    })
                }
            },
            mounted() {
                this.mainIndustryList = window.industryInfo;
            }
        });
        Vue.component('industryPanle2', {
            template: `<div class='industry-panle2'>
            <div class='child-industry'>
            <ul>
            <li v-for="(item,index) in mainIndustryList" :key="index" @click="getChild(item)" >
            <span class="area-panel-info"
             :class="item.id==currentMainId?'checked':''" 
             :title="item.name">{{item.name}}</span>
            </li>
            </ul> </div>                                   
            </div>`,
            data() {
                return {
                    mainIndustryList: [],
                    childIndustryList: [],
                    currentMainName: null,
                    currentMainId: null,
                    currentChildId: null
                }
            },
            methods: {
                getChild(item) {
                    this.currentMainId = item.id;
                    this.currentMainName = item.name;
                    // this.childIndustryList = item.subIndustrys;
                    this.$emit('industryResult', {
                        pid: this.currentMainId,
                        childIds: null,
                        name: this.currentMainName
                    })
                },
                // checkedIndustry(item) {
                //     this.currentChildId = item.id;
                //     this.$emit('industryResult', {
                //         pid: this.currentMainId,
                //         childIds: this.currentChildId,
                //         name: this.currentMainName
                //     })
                // }
            },
            mounted() {
                this.mainIndustryList = [
                    {
                        "id": null,
                        "name": "全部"
                    }
                    , ...window.industryInfo];

            }
        });
        Vue.component('vue-area', {
            template: `<div class=''>
            <div class="head">
            <span class="area" @click="step=1" :class="step==1?'checked':''"><span class="item">{{areaInfoStr}}</span></span>
            <span class='industry' @click="step=2" :class="step==2?'checked':''"><span class="item">{{industryStr}}</span></span>           
            </div>
            <button class='search' style='    position: fixed;
            left: 346px;
            top: 11px;
            background-color: rgb(0, 129, 255);
            color: rgb(255, 255, 255);
            width: 62px;
            height: 40px;
            display: inherit;
            text-align: center;
            margin-left: 10px;' @click="search">搜索</button>              
            <div v-show="step==1" class="vue-area">
            <area-detail ref="ad" @changeArea="changeArea" @callResult="callResult"></area-detail>
            <area-panle ref="ap" :areaList="areaList" @choiseInfo="choiseInfo"></area-panle>            
            </div>
            <div v-show="step==2">
            <industryPanle2 @industryResult="industryResult"></industryPanle2>
            </div>
            </div>`,
            comments: {
                AreaDetail
            },
            data() {
                return {
                    areaList: {},
                    step: 0,
                    //0:省 1:市 2:区
                    checked: 0,
                    areaInfo: {
                        provinceId: '430000',
                        provinceName: '湖南省',
                        cityId: '430100',
                        cityName: '长沙市',
                        areaId: '',
                        areaName: ''
                    },
                    industryInfo: {
                        pid: null,
                        childIds: null,
                        name: '全部'
                    },
                    areaInfoStr: '湖南省/长沙市',
                    industryStr: '全部'
                }
            },
            methods: {
                changeArea(area, id, cid) {
                    let temp = [];
                    if (id) {
                        temp = window.areaInfo[id];
                    }
                    switch (area) {
                        case 'province':
                            this.areaList = temp.length || window.areaInfo["86"];
                            this.checked = 0;             
                            break;
                        case 'city':
                            this.areaList = temp
                            this.checked = 1;   
                            break;
                        case 'area':
                            this.areaList = temp
                            this.checked = 2;
                            break;
                    }
                    if (cid) {
                        this.$refs.ap.setCurrentId(cid);
                    }
                },
                choiseInfo(item, id) {
                    let choiseName = '';
                    switch (this.checked) {
                        case 0:
                            choiseName = 'province';
                            break;
                        case 1:
                            choiseName = 'city';          
                            break;
                        case 2:
                            choiseName = 'area';
                            break;
                        default:
                            choiseName = 'province';
                            break;
                    }
                    this.$refs.ad.setData(choiseName, item, id);
                },
                search() {
                    this.step = 0;
                    window.search(this.areaInfo, this.industryInfo);
                },
                callResult(data) {
                    console.log(data);
                    this.areaInfo = data;
                    // this.areaInfoStr = data.provinceName + '/' + (data.cityName || '--') + '/' +
                    //     (data.areaName || '--');

                    var cityName = data.cityName, cityId = data.cityId, areaName = data.areaName, areaId = data.areaId;

                    if (cityId != -1) {
                        cityName = cityName || '--';
                    }
                    else {
                        cityName = null;
                    }

                    if (areaId != -1) {
                        areaName = areaName || '--';
                    }
                    else {
                        areaName = null;                        
                    }

                    if (cityName && areaName) {
                        this.areaInfoStr = data.provinceName + '/' + (cityName || '--')
                            + '/' + (areaName || '--');
                    }
                    else if (cityName) {
                        this.areaInfoStr = data.provinceName + '/' + (cityName || '--');
                    }
                    else {
                        this.areaInfoStr = data.provinceName;
                    }
                    this.areaInfo.cityName=cityName;
                    this.areaInfo.cityId=cityId;                    
                    this.areaInfo.areaName=areaName;
                    this.areaInfo.areaId=areaId;                    
                },
                industryResult(data) {
                    this.industryInfo = data;
                    this.industryStr = data.name;
                }
            }
        });
    }

    static init() {
        new Vue({
            el: '#map-container',
            methods: {
            },
            mounted: function () {

            }
        })
    }
}

window.onload = () => {
    MapInfo.initComponent();
    MapInfo.init();
}