// Public demonstration credentials, intentionally visible in client source.
// This is a local interaction gate, never a secure authentication system.
export const DEMO_USERNAME = '何珈俊';
export const DEMO_PASSWORD = '123456';
export const DEMO_ROLES = ['audience','player','referee','staff'] as const;
export type Role = typeof DEMO_ROLES[number];
export type User = {id:string;username:string;displayName:string;role:Role;school:string;teamId?:string};
export const roleNames:Record<Role,string> = {audience:'观众',player:'选手 / 球队',referee:'裁判',staff:'赛务'};
export function authenticateDemo(role:string,username:string,password:string):User {
 if(!DEMO_ROLES.includes(role as Role)||username.trim()!==DEMO_USERNAME||password!==DEMO_PASSWORD)throw Error('演示账号或密码不正确，请使用页面提示的统一演示账号。');
 return {id:'demo-'+role,username:DEMO_USERNAME,displayName:'演示'+roleNames[role as Role],role:role as Role,school:role==='player'?'示例大学':'',...(role==='player'?{teamId:'demo-team'}:{})};
}
export function sampleAthletes(){return [1,2,3].map((number)=>({name:['示例球员甲','示例球员乙','示例球员丙'][number-1],number,position:number===1?'GK':'FW',sex:'男',birthDate:'2006-01-01',idNumber:'DEMO-ID-'+number,studentId:'DEMO-STUDENT-'+number,studyForm:'全日制（虚构）',major:'足球运动（示例）',gradeClass:'演示班',educationLevel:'本科（示例）',studyYears:'4',enrollmentDate:'2024-09-01',newStudentType:'其他'}));}
export function sampleOfficials(){return [{role:'领队',name:'示例领队',phone:''},{role:'主教练',name:'示例教练',phone:''},{role:'助理教练',name:'示例助教甲',phone:''},{role:'助理教练',name:'示例助教乙',phone:''},{role:'队医',name:'示例队医',phone:''}];}
const copy=<T,>(x:T):T=>JSON.parse(JSON.stringify(x));
const makeTeam=(id:string,school:string,status:string)=>({id,eventId:'gd-university-ab',groupId:'男子甲A组',school,name:school+'演示队',contactName:'示例领队',contactPhone:'演示号码，不填真实电话',status,privacyConsent:false,athletes:sampleAthletes(),officials:sampleOfficials(),materials:[],emailReceipts:[],reviewReason:'',rosterLocked:status!=='draft'});
export function createDemoStore(){
 const state:any={teams:[makeTeam('demo-team','示例大学','draft'),makeTeam('demo-pending','示例大学乙','submitted'),makeTeam('demo-approved-a','示例大学丙','approved'),makeTeam('demo-approved-b','示例大学丁','approved')],accounts:DEMO_ROLES.map(role=>({id:'demo-'+role,username:DEMO_USERNAME,displayName:'演示'+roleNames[role],role,school:role==='player'?'示例大学':''})),matches:[
 {id:'demo-match-1',eventId:'gd-university-ab',groupId:'男子甲A组',homeTeamId:'demo-approved-a',awayTeamId:'demo-approved-b',homeName:'示例大学丙演示队',awayName:'示例大学丁演示队',startAt:'2026-11-05T15:00:00+08:00',venue:'示例足球场A',refereeId:'demo-referee',status:'scheduled',homeScore:null,awayScore:null},
 {id:'demo-match-2',eventId:'gd-university-ab',groupId:'男子甲A组',homeTeamId:'demo-approved-b',awayTeamId:'demo-approved-a',homeName:'示例大学丁演示队',awayName:'示例大学丙演示队',startAt:'2026-11-06T15:00:00+08:00',venue:'示例足球场B',refereeId:'demo-referee',status:'score_submitted',homeScore:2,awayScore:1},
 {id:'demo-match-3',eventId:'gd-university-ab',groupId:'男子甲A组',homeTeamId:'demo-approved-a',awayTeamId:'demo-approved-b',homeName:'示例大学丙演示队',awayName:'示例大学丁演示队',startAt:'2026-10-18T15:00:00+08:00',venue:'示例足球场A',refereeId:'demo-referee',status:'published',homeScore:1,awayScore:1}],announcements:[{id:'demo-notice',title:'欢迎体验校园足球功能演示站',body:'所有球队、人员、比赛和操作记录均为虚构示例。登录任一角色体验流程；退出后可登录另一角色继续本页演示。刷新页面会清空操作。请勿填写或选择真实报名资料。',tag:'演示说明',date:'功能演示'}],files:[],audit:[],configs:[],eligibility:[]};
 let sequence=0;
 function requireRole(actor:User|null,allowed:Role[]){if(!actor||!allowed.includes(actor.role))throw Error('请登录对应演示身份后操作。');}
 function teamFor(id:string,actor:User){const team=state.teams.find((t:any)=>t.id===id);if(!team)throw Error('未找到示例队伍。');if(actor.role==='player'&&team.school!==actor.school)throw Error('演示选手仅管理本校示例队伍。');return team;}
 const log=(action:string)=>state.audit.unshift({id:'demo-log-'+(++sequence),action:'演示：'+action,createdAt:Date.now()});
 function publicData(){return copy({announcements:state.announcements,matches:state.matches.map((m:any)=>({...m,homeScore:m.status==='published'?m.homeScore:null,awayScore:m.status==='published'?m.awayScore:null,status:m.status==='published'?'published':'scheduled',notes:undefined})),summary:{approvedTeams:state.teams.filter((t:any)=>t.status==='approved').length,schools:4}});}
 function workspace(actor:User|null){if(!actor)return {teams:[],accounts:[],matches:[],files:[],audit:[],configs:[],eligibility:[]};const staff=actor.role==='staff';return copy({...state,teams:staff?state.teams:actor.role==='player'?state.teams.filter((t:any)=>t.school===actor.school):[],accounts:staff?state.accounts:[],matches:staff?state.matches:actor.role==='referee'?state.matches.filter((m:any)=>m.refereeId===actor.id):publicData().matches,files:staff?state.files:actor.role==='player'?state.files.filter((f:any)=>state.teams.some((t:any)=>t.id===f.teamId&&t.school===actor.school)):[],audit:staff?state.audit:[]});}
 function dispatch(action:string,payload:any,actor:User|null):any {
  if(action==='saveTeam'){
   requireRole(actor,['player','staff']);const id=payload.id||'demo-created-'+(++sequence);const existing=state.teams.find((t:any)=>t.id===id);if(existing)teamFor(id,actor!);
   const immutable=(t:any)=>JSON.stringify({eventId:t.eventId,groupId:t.groupId,school:t.school,name:t.name,athletes:(t.athletes||[]).map((a:any)=>{const x={...a};delete x.identityFileId;delete x.enrollmentFileId;return x}),officials:t.officials});
   if(existing?.rosterLocked&&immutable(existing)!==immutable({...existing,...payload}))throw Error('演示名单已锁定，可以补充示例材料。');
   const team={...copy(existing||makeTeam(id,actor!.school,'draft')),...copy(payload),id,school:actor!.role==='player'?actor!.school:payload.school,status:existing?.status||'draft',rosterLocked:existing?.rosterLocked||false};const index=state.teams.findIndex((t:any)=>t.id===id);if(index<0)state.teams.push(team);else state.teams[index]=team;log('保存示例报名');return {team:copy(team),message:'演示草稿已保存在本次页面，未发送任何资料。'};
  }
  if(action==='submitTeam'){
   requireRole(actor,['player','staff']);const team=teamFor(payload.teamId,actor!);if(!team.athletes?.length)throw Error('请先添加虚构运动员或生成示例名单。');if(!team.privacyConsent)throw Error('请勾选“仅使用虚构资料演示”。');if(['submitted','approved'].includes(team.status))throw Error('示例名单已提交。');team.status='submitted';team.rosterLocked=true;log('提交示例名单');return {team:copy(team),message:'演示名单已提交。切换赛务角色可查看审核，不构成真实报名。'};
  }
  if(action==='markMaterial'){
   requireRole(actor,['player','staff']);const team=teamFor(payload.teamId,actor!);const file={id:'demo-file-'+(++sequence),teamId:team.id,kind:payload.kind,name:'虚构示例材料.pdf',size:512000};state.files.push(file);log('标记虚构材料');return {file:copy(file),message:'已生成示例材料标记，没有选择或读取真实文件。'};
  }
  if(action==='reviewTeam'){
   requireRole(actor,['staff']);const team=teamFor(payload.teamId,actor!);if(team.status!=='submitted')throw Error('请选择待审核的示例报名。');if(payload.status==='returned'&&!String(payload.reason||'').trim())throw Error('请填写示例补正原因。');if(payload.status==='approved'&&!['eligibility','health','insurance','signatures'].every(k=>payload.confirmations?.[k]))throw Error('请勾选四项模拟核验确认。');team.status=payload.status;team.reviewReason=payload.reason||'';log('审核示例报名');return {message:'演示审核结果已更新，仅本页有效。'};
  }
  if(action==='submitScore'){
   requireRole(actor,['referee']);const match=state.matches.find((m:any)=>m.id===payload.matchId&&m.refereeId===actor!.id);if(!match)throw Error('只能填写本演示裁判的任务。');if(match.status==='published')throw Error('示例比分已发布。');if(![payload.homeScore,payload.awayScore].every(n=>Number.isInteger(Number(n))&&Number(n)>=0&&Number(n)<=99))throw Error('比分应为0—99的整数。');Object.assign(match,{homeScore:Number(payload.homeScore),awayScore:Number(payload.awayScore),notes:payload.notes||'',status:'score_submitted'});log('提交示例比赛报告');return {message:'演示报告已提交；切换赛务发布后观众可见比分。'};
  }
  if(action==='publishScore'){
   requireRole(actor,['staff']);const match=state.matches.find((m:any)=>m.id===payload.matchId);if(match?.status!=='score_submitted')throw Error('请先由演示裁判提交比赛报告。');match.status='published';log('发布示例成绩');return {message:'示例成绩已在本页公开，刷新后重置。'};
  }
  if(action==='saveMatch'){
   requireRole(actor,['staff']);const home=state.teams.find((t:any)=>t.id===payload.homeTeamId),away=state.teams.find((t:any)=>t.id===payload.awayTeamId);if(!home||!away||home.id===away.id)throw Error('请选择两支不同的示例队伍。');state.matches.push({...copy(payload),id:'demo-match-'+(++sequence+10),homeName:home.name,awayName:away.name,status:'scheduled',homeScore:null,awayScore:null});log('安排示例比赛');return {message:'示例赛程已加入本页赛程。'};
  }
  if(action==='saveAnnouncement'){
   requireRole(actor,['staff']);state.announcements.unshift({id:'demo-notice-'+(++sequence),title:String(payload.title||'示例公告'),body:String(payload.body||''),tag:'本页演示公告',date:'刚刚'});log('发布示例公告');return {message:'示例公告已在本页展示，未对外发送消息。'};
  }
  if(['saveConfig','updateEligibility','importFirstStage'].includes(action)){
   requireRole(actor,['staff']);if(action==='saveConfig')state.configs.push(copy(payload));if(action==='updateEligibility')state.eligibility.push(copy(payload));log(action==='importFirstStage'?'载入虚构学校资格':'修改示例设置');return {message:'演示设置已记录；没有导入真实报名表，也不开放真实报名。'};
  }
  throw Error('此功能在演示站仅展示界面，不管理真实账号或资料。');
 }
 return {dispatch,workspace,publicData};
}
