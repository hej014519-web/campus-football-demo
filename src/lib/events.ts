export type FootballEvent={id:string;name:string;shortName:string;kind:string;format:string;date:string;location:string;deadline:string;stage1Deadline?:string;status:string;confirmed:boolean;minPlayers:number;maxPlayers:number;matchPlayers:number;minGoalkeepers:number;groups:string[];documents:string[];source:string;notes:string[];officials:{role:string;count:number}[]};
const universityGroups=['男子甲A组','男子甲B组','男子乙A组','男子乙B组','男子丙A组','男子丙B组','女子甲A组','女子甲B组','女子乙组','女子丙组'];
const gdDocs=['报名表电子版及盖章扫描件','运动员信息汇总表电子版及盖章扫描件','学籍证明或教育部学籍在线验证报告','身份证或港澳台通行证头像面','风险告知书（签名并盖章）','保险凭证（赛区备查）'];
const gdOfficials=[{role:'领队',count:1},{role:'主教练',count:1},{role:'助理教练',count:2},{role:'队医',count:1}];
const gdNotes=['第一阶段报名已于10月15日12:00截止，只有已报名学校及组别可继续。','各校每组限1队；名单及号码首次提交后锁定，不接受后补。','第二阶段截止后5天内完成指定邮箱报送，站内上传不能代替正式邮件。'];
export const EVENTS:FootballEvent[]=[
{id:'gd-university-ab',name:'2026年广东省青少年校园足球联赛 · 大学甲、乙组总决赛',shortName:'广东省校园足球联赛',kind:'省级赛事',format:'11人制 / 8人制',date:'2026年11月 · 具体日期待通知',location:'暨南大学等4所高校（具体安排待通知）',deadline:'2026-10-22T12:00:00+08:00',stage1Deadline:'2026-10-15T12:00:00+08:00',status:'第二阶段材料准备',confirmed:true,minPlayers:0,maxPlayers:25,matchPlayers:20,minGoalkeepers:0,groups:universityGroups.filter(g=>!g.includes('丙')),documents:gdDocs,source:'省级赛事通知 · PDF第21—27、39—40页',notes:[...gdNotes,'女子甲A、甲B组8人制：报名最多20人，到赛区最多16人。其余大学组别11人制：报名最多25人，到赛区最多20人。'],officials:gdOfficials},
{id:'gd-university-c',name:'2026年广东省青少年校园足球联赛 · 大学丙组总决赛',shortName:'广东省校园足球联赛',kind:'省级赛事',format:'11人制 / 8人制',date:'2026年12月 · 具体日期待通知',location:'待组委会通知',deadline:'2026-11-16T12:00:00+08:00',stage1Deadline:'2026-10-15T12:00:00+08:00',status:'第二阶段材料准备',confirmed:true,minPlayers:0,maxPlayers:25,matchPlayers:20,minGoalkeepers:0,groups:['男子丙A组','男子丙B组','女子丙组'],documents:gdDocs,source:'省级赛事通知 · PDF第21—27、39—40页',notes:[...gdNotes,'女子丙组8人制：报名最多20人，到赛区最多16人。男子丙A、丙B组11人制：报名最多25人，到赛区最多20人。'],officials:gdOfficials},
{id:'national-major',name:'第二届全国高校足球运动专业足球联赛',shortName:'全国高校足球运动专业联赛',kind:'全国赛事',format:'11人制',date:'赛事日期待确认',location:'定南县（国家）青少年足球训练中心',deadline:'2026-11-08T23:59:59+08:00',status:'信息待确认',confirmed:false,minPlayers:20,maxPlayers:25,matchPlayers:25,minGoalkeepers:2,groups:['女子组','男子组'],documents:['正式报名表','队医应急救护资格证书'],source:'赛事筹备信息，待正式通知核验',notes:['42所高校、84支队伍（男足42支、女足42支），为筹备阶段信息，待组委会确认。','日期存在两版：女子11月17—28日、男子12月1—12日；另版11月26日—12月9日，暂不接受正式提交。','原信息报名截止：女子11月8日前，男子11月22日前。','领队为赛风赛纪责任人，主教练为反兴奋剂责任人；外籍主教练可增报翻译1人。'],officials:[{role:'领队',count:1},{role:'主教练',count:1},{role:'助理教练',count:1},{role:'队医',count:1},{role:'队务',count:1}]},
{id:'futsal-men-south',name:'学体联2026年全国大学生五人制足球一级联赛男子组南区',shortName:'全国大学生五人制一级联赛',kind:'全国赛事',format:'5人制',date:'2026.10.22 — 11.01',location:'安徽滁州',deadline:'',status:'赛程参考',confirmed:false,minPlayers:0,maxPlayers:0,matchPlayers:0,minGoalkeepers:0,groups:['男子组南区'],documents:[],source:'学体联赛事计划安排表（参考）',notes:['图片仅提供赛事计划，不包含报名规则，正式报名暂未开放。'],officials:[]},
{id:'futsal-women-final',name:'学体联2026年全国大学生五人制足球一级联赛女子组总决赛',shortName:'全国大学生五人制一级联赛',kind:'全国赛事',format:'5人制',date:'2026.12.21 — 12.31',location:'云南玉溪',deadline:'',status:'赛程参考',confirmed:false,minPlayers:0,maxPlayers:0,matchPlayers:0,minGoalkeepers:0,groups:['女子组'],documents:[],source:'学体联赛事计划安排表（参考）',notes:['图片仅提供赛事计划，报名规则待补充。'],officials:[]},
{id:'highschool-gd',name:'2026年广东省青少年校园足球联赛 · 高中组总决赛',shortName:'广东省校园足球联赛·高中组',kind:'省级赛事',format:'11人制',date:'2026年11—12月 · 具体安排待通知',location:'参赛学校足球场，具体安排待定',deadline:'2026-10-22T16:00:00+08:00',status:'规程参考',confirmed:false,minPlayers:0,maxPlayers:0,matchPlayers:20,minGoalkeepers:0,groups:['高中男子组','高中女子组'],documents:[],source:'省级赛事通知 · PDF第4—20页',notes:['高中组目前仅提供规程参考，尚未配置地市名额、未成年人材料及资格审核流程，暂不接受站内报名。','报名运动员最多25人，到赛区最多20人；须2008年9月1日及以后出生，转学须满6个月。','第一阶段10月15日15:00已截止，第二阶段截止10月22日16:00，区别于大学组12:00。','风险告知书须每位运动员、领队和监护人签名并盖章；资格材料报送zige1206@126.com，风险书报送3082611@qq.com。','赛前替补名单存在9人与7人两种表述，须组委会澄清后再配置。'],officials:[]}
];
export function getEvent(id:string){return EVENTS.find(e=>e.id===id);}
export const REFERENCE_SCHEDULE=[
{name:'全国大学生沙滩足球锦标赛',date:'10月8—17日',location:'山东威海',state:'计划已结束'},
{name:'五人制一级联赛 · 男子北区',date:'10月25日—11月4日',location:'河北秦皇岛',state:'赛事计划'},
{name:'五人制一级联赛 · 男子南区',date:'10月22日—11月1日',location:'安徽滁州',state:'赛事计划'},
{name:'五人制二级联赛 · 男子总决赛',date:'11月3—13日',location:'安徽滁州',state:'赛事计划'},
{name:'五人制二级联赛 · 女子总决赛',date:'11月14—24日',location:'安徽滁州',state:'赛事计划'},
{name:'五人制一级联赛 · 男子总决赛',date:'12月10—19日',location:'云南玉溪',state:'赛事计划'},
{name:'五人制一级联赛 · 女子总决赛',date:'12月21—31日',location:'云南玉溪',state:'赛事计划'}
];
