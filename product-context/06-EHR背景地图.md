# 07-EHR背景地图.md

> 本文件用于为需求设计提供 **Fastreat EHR** 的稳定背景上下文。涉及 EHR 系统相关需求时，优先阅读本文件，再结合术语表、设计原则库和交互模式库补充细节。

## 一、产品定位

**Fastreat EHR** 是 Fastreat 针对 **ADHD（注意缺陷多动障碍）** 领域的专业电子健康与医疗管理系统。系统主要服务于**医生（Provider）、运营人员（Operations）与管理人员（Management）**。旨在通过全流程数字化管理，打通从患者预约、在线问诊、诊疗记录（Provider Note）、处方开立与续方申请、药房传真、电子病历/医疗文件管理到数据看板的全链条业务，提升 ADHD 诊疗效率与医疗服务质量。

## 二、核心页面地图

根据系统导航结构与各模块界面设计，EHR 系统核心功能模块如下：

1. **首页 (Home Page / 工作台)**
   - 作为医生与运营人员的核心日常工作台，以**待办事项看板 (Task/Worklist Dashboard)** 形式呈现：
     - **预约日程 (Your Appointment)**：展示今日预约（Today）、未来预约（Future）及待确认预约（Pending Confirm），支持快捷发起/加入 Zoom 视频诊疗（Join with Zoom）。
     - **待完成诊疗笔记 (Pending Patient Note)**：分类展示待撰写笔记（Pending Note）与待出院/结案记录（Pending Discharge），支持直接跳转补充病历（Add Notes）。
     - **待处理续方申请 (Pending Prescription Renewal Request)**：包含当前续方申请（Current Request）、计划/定时申请（Scheduled Request）与争议申请（Requesting Dispute），呈现关键药历（上次履约状态、上次取药日期等）。
     - **未解决咨询消息 (Unsolved Consultation Message)**：按“医生未回复 (Unreplied by Provider)”与“患者未回复 (Unreplied by Patient)”分类，支持超时提醒（Provider Overdue）。
     - **患者评价 (Patient Review)**：展示患者对诊疗服务的评分（如 5/5 Ratings）与月度评价（Monthly Review），支持查看及发起申诉（Dispute）。

2. **患者管理 (Patient)**
   - 患者个人档案、病史记录、ADHD 评估历史及随访状态管理。

3. **预约管理 (Appointment)**
   - 管理患者门诊/复诊预约、接诊状态排期及变更记录。

4. **诊疗笔记 (Provider Note)**
   - 医生接诊专用的临床病程记录与评估工具，支持录入 ADHD 诊断细节及诊疗计划。

5. **处方管理 (Prescriptions)**
   - ADHD 相关药物处方的开立、审核、续方及历史处方调阅。

6. **图文/视频问诊 (Consultation)**
   - 医生与患者/家属在线沟通咨询的核心管理模块，主要包含：
     - **状态Tab分类**：未解决（Unsolved）、已解决（Solved）、自动解决（Auto-solved）。
     - **通用与筛选能力**：支持按条件筛选（Filter），以及个人名片分享（Share My Profile）。
     - **列表核心字段**：
       - **主题与类型**：主题（Subject）、类型（Type，如 Provider Message）。
       - **回复状态**：回复状态（Reply Status，如 Unreplied By Patient / Unreplied By Provider）。
       - **沟通与时效指标**：回复数（Replies）、患者类型（Patient Type，如 Adult / Pediatric）、未回复时长（Unreplied Duration）、超时状态（Reply Overdue Status，如 Patient Overdue / Provider Overdue）。
       - **患者信息**：患者姓名（Patient Name）。

7. **日历行程 (Calendar)**
   - 展现医生排班表、接诊日程安排及运营团队排班视图。

8. **药房传真 (Pharmacy Fax)**
   - 处方流转与药房对接，支持电子处方传真发送、状态追踪与异常处理。

9. **医疗文件 - 新 (Medical Files New)**
   - 处理与归档最新上传的患者医疗记录、外院报告及量表文件。

10. **医疗文件 - 归档 (Medical Files Old)**
    - 历史医疗文件与旧档案的查阅与检索。

11. **数据看板 (Dashboard)**
    - 面向管理与运营人员，提供诊疗人次、处方续方率、患者留存及运营效率等关键指标分析。

12. **社区中心 (Community Center)**
    - 患教知识库、社区支持与健康指导内容管理。

## 三、关键角色与能力边界

1. **医生 (Provider)**
   - **核心入口**：首页工作台（Home Page）、问诊咨询（Consultation）、诊疗笔记（Provider Note）、处方管理（Prescriptions）、患者档案（Patient）与日历行程（Calendar）。
   - **能力边界**：在首页及 Consultation 页面快速响应患者咨询、完成预约接诊（Join with Zoom）、病历补全（Pending Note）与续方审核；具备临床诊断与处方开立权限，不直接参与系统排班规则配置与高阶运营数据分析。

2. **运营人员 (Operations)**
   - **核心入口**：首页未回复消息/评价管理、问诊咨询（Consultation）、预约管理（Appointment）、药房传真（Pharmacy Fax）与文件管理（Medical Files）。
   - **能力边界**：协助监控 Consultation 中的超时未回复状态（Provider Overdue / Patient Overdue），处理患者预约确认、续方申请前置审核、药房对接及患者评价申诉（Dispute），无处方开立与临床诊断权限。

3. **管理人员 (Management)**
   - **核心入口**：数据看板（Dashboard）、患者评价（Patient Review）监督、合规审计与系统全局配置。
   - **能力边界**：关注全局业务数据、服务满意度（Ratings）、咨询响应时效与合规指标，指导经营决策。

## 四、关键对象与术语

1. **工作台待办看板 (Home Page Worklist)**：
   - 聚合预约、笔记、续方、问诊及评价等多维度高优先级任务的统一工作台看板。
2. **问诊咨询 (Consultation Message)**：
   - 医生与患者之间的在线沟通消息流，划分为 Unsolved、Solved 与 Auto-solved 状态，包含超时预警机制。
3. **超时回复状态 (Reply Overdue Status)**：
   - 包括医生超时未回复（Provider Overdue）与患者超时未回复（Patient Overdue），用于衡量咨询响应时效与服务质量。
4. **ADHD 诊疗笔记 (Provider Note)**：
   - 医生在诊疗过程中针对患者 ADHD 症状、行为表现及治疗反应记录的核心临床文档，分为 Pending Note（待完成）与 Pending Discharge（待结案）。
5. **续方申请 (Prescription Renewal Request)**：
   - ADHD 管制药品（如中枢神经兴奋剂）的定式/定期续药申请，分为 Current Request、Scheduled Request 与 Requesting Dispute。
6. **药房传真 (Pharmacy Fax)**：
   - 将签署完成的处方安全传输至合作药房的自动化传真系统及其状态追踪。

## 五、已知设计约束

1. **以“待办驱动 + 患者临床诊疗路径”为核心**：
   - 首页及 Consultation 模块强调**待办驱动 (Task-driven)** 与**时效监控**，通过 Badge 红点数字及超时状态标签（Overdue Status）引导医生与运营高效处理积压与超时咨询。
   - 系统设计紧密围绕“预约 -> 问诊/咨询 -> 诊疗笔记 -> 处方续方 -> 药房传真”的全流程展开，减少跨页面切换。
2. **处方与传真续方的合规性与安全性**：
   - 涉及 ADHD 管制药品处方开立与续方审核（Prescription Renewal）时，必须呈现上次履约状态（Last Fulfillment Status）、上次取药日期（Last Pickup Date）等合规依据，具备严格的身份校验与日志留痕机制。
3. **多角色权限与视界隔离**：
   - 首页各类待办模块、Consultation 咨询处理及侧边栏菜单必须根据登录角色（医生、运营、管理）进行严格的权限控制与数据隔离。

## 六、资料来源
