'use strict';

/** @type {import('@adonisjs/lucid/src/Database')} */
const Database = use('Database');

class SkillSetsSeeder {
  /*
  |  You need to add the "static" modifier
  |  so you don't need to instantiate the class
  |  inside the "DatabaseSeeder", making the code
  |  easier to read and write.
  */
  static async run() {
    const skills = [
      // Registered Nurse , personal care
      {
        caregiver_type: 1,
        type: '1',
        english_title: 'Accompany to Walk Around / Do Mild Exercise',
      },
      { caregiver_type: 1, type: '1', english_title: 'Lifting' },
      { caregiver_type: 1, type: '1', english_title: 'Bathing' },
      {
        caregiver_type: 1,
        type: '1',
        english_title: 'Toileting / Change Diaper / Clean Up Excertion',
      },
      {
        caregiver_type: 1,
        type: '1',
        english_title: 'Feeding (Non-tube feeding)',
      },
      {
        caregiver_type: 1,
        type: '1',
        english_title: 'Feed Medicine',
      },
      {
        caregiver_type: 1,
        type: '1',
        english_title: 'Measure Weight / Blood Pressure / Body Temperature',
      },
      { caregiver_type: 1, type: '1', english_title: 'Oral Care' },
      {
        caregiver_type: 1,
        type: '1',
        english_title: 'Measure Blood glucose',
      },

      {
        caregiver_type: 1,
        type: '1',
        english_title: 'Insulin injection',
      },
      {
        caregiver_type: 1,
        type: '1',
        english_title: 'Injection* (Intramuscular / Intravenous)',
      },

      // Registered Nurse , special care
      {
        caregiver_type: 1,
        type: '2',
        english_title: 'Oxygen Therapy',
        en_explanation:
          "<b> 1. What is it? </b> <br> Provide extra oxygen to reduce heart load. It reduces discomfort and out of breadth caused by lack of oxygen, thereby helping to improve mobility, reduce number of hospital admission, and live longer. <br><br> <b> 2. Users: </b> <br> Commonly for patients with chronic obstructive pulmonary disease (COPD) <br><br> Source: <a target='_blank' href='https://www3.ha.org.hk/ntwc/pep/2016/17.pdf'>Hospital Authority</a>",
        ch_explanation:
          "<b> 1. 甚麼來的? </b> <br> 提供額外氧氣，減低心臟負荷，亦減低因缺氧而產生的身體不適及減少氣喘。改善活動能力、減少入院次數及延長壽命。<br><br> <b> 2. 使用者： </b> <br> 常見用於患肺部或循環系統毛病人士。 <br><br> 來源： <a target='_blank' href='https://www3.ha.org.hk/ntwc/pep/2016/17.pdf'>醫院管理局</a>",
      },
      {
        caregiver_type: 1,
        type: '2',
        english_title: 'Change Urine Bags / Fecal Bags',
      },
      {
        caregiver_type: 1,
        type: '2',
        english_title: 'Stoma Care',
        en_explanation:
          "<b> 1. What is it? </b> <br> After removing parts of the colon or rectum from surgery, stoma is an artificial opening created to release fasces or urine from the intestine or urethra. <br> <br> Given that the patient cannot control excretion, it is necessary to place an ostomy bag on the stoma in order to collect excretion. <br><br> <b> 2. Users: </b> <br> Commonly in patients with colorectal cancer. <br><br> <b> 3. Causes: </b> <br> Common in patients who have a malignant tumor in rectum or anus; the rectum, anus, and sphincter have to be removed as a result. <br><br> Source: <a target='_blank' href='https://www3.ha.org.hk/pwh/patient%20edu/colostomy/ileostomy.pdf'>Hospital Authority (Chinese only),</a> <a target='_blank' href='http://www.stoma.org.hk/tc/colon_stoma'>Hong Kong Stoma Association (Chinese only),</a> and <a target='_blank' href='https://www.coloplast.com.hk/en-HK/products/Ostomy-Care/'>Colopast</a>",
        ch_explanation:
          "<b> 1. 甚麼來的? </b> <br> 造口(假肛)是在手術的過程中，將部份結腸或直腸切除後造成的人工開口，用於從腸道或尿道排放糞便或尿液。<br> 由於患者並不能控制排泄物排出，故此需要在造口位置貼上造口袋，收集排泄物。<br><br> <b> 2. 使用者： </b> <br> 常見用於大腸癌患者。<br><br> <b> 3. 成因： </b> <br> 常見是直腸或肛門有惡性腫瘤，需要將直腸，肛門及括約肌全部切除。<br><br> 來源： <a target='_blank' href='https://www3.ha.org.hk/pwh/patient%20edu/colostomy/ileostomy.pdf'>醫院管理局、</a> <a target='_blank' href='http://www.stoma.org.hk/tc/colon_stoma'>香港造口人協會、</a> 及 <a target='_blank' href='https://www.coloplast.com.hk/en-HK/products/Ostomy-Care/'>Colopast</a>",
      },
      {
        caregiver_type: 1,
        type: '2',
        english_title: 'Nasogastric Tube Feeding',
        en_explanation:
          "<b> 1. What is it? </b> <br> Tube filled with liquid diet to provide calories, nutrition and medicine to the patient. <br><br> <b> 2. Users: </b> <br> Commonly used in patients with stroke and nasopharyngeal cancer. <br><br> <b> 3. Causes: </b> Unable to eat or have swallow difficulties or have specific gastrointestinal disorders. <br><br> Source: <a target='_blank' href='https://www.chp.gov.hk/tc/wapdf/204.html?page=34'>Department of Health</a>",
        ch_explanation:
          "<b> 1. 甚麼來的? </b> <br> 用管子灌以流質食物進食以提供熱量、營養與藥物。 <br><br> <b> 2. 使用者：</b> <br> 常見用於腦中風及鼻咽癌患者。<br><br> <b> 3. 成因： </b> <br> 無法由口進食或吞嚥困難，或患特定腸胃道疾病。<br><br> 來源： <a target='_blank' href='https://www.chp.gov.hk/tc/wapdf/204.html?page=34'>衛生署</a>",
      },
      {
        caregiver_type: 1,
        type: '2',
        english_title: 'PEG Feeding / Gauze and Tape Dressing',
        en_explanation:
          "<b> 1. What is it? </b> <br> A gastrostomy is a procedure to create an artificial stoma on the stomach and abdominal wall, allowing the gastrostomy tube to be inserted directly into the stomach through the abdominal wall. The tube can then transport fluid directly to the stomach through nose and gullet. <br><br> <b> 2. Users: </b> <br> Commonly used in patients with stroke and nasopharyngeal cancer. <br><br> <b> 3. Causes: </b> <br> Unable to eat or have swallow difficulties or have specific gastrointestinal disorders. <br><br> Source: <a target='_blank' href='https://www3.ha.org.hk/ntwc/pep/2015/11.pdf'>Hospital Authority (Chinese only)</a>",
        ch_explanation:
          "<b> 1. 甚麼來的? </b> <br> 胃造口是利用手術方法在胃及腹壁上建立一個人工造口，讓胃造口導管穿過腹壁直接插入胃，不經鼻及食道輸送流質液體到胃部。<br><br> <b> 2. 使用者： </b> <br> 常見用於腦中風及鼻咽癌患者。<br><br> <b> 3. 成因： </b> <br> 無法由口進食或吞嚥困難，或患特定腸胃道疾病。 <br><br> 來源： <a target='_blank' href='https://www3.ha.org.hk/ntwc/pep/2015/11.pdf'>醫院管理局</a>",
      },
      {
        caregiver_type: 1,
        type: '2',
        english_title: 'Peritoneal Dialysis / Catheter (Soft Tube) Care',
      },
      { caregiver_type: 1, type: '2', english_title: 'Wound Care' },
      {
        caregiver_type: 1,
        type: '2',
        english_title:
          'Memory Training / Cognitive Training / Behavioural Treatment',
        en_explanation:
          "<b> 1. What is it? </b> <br> • Memory training: Activities such as recall and recitation to improve memory. <br> • Cognitive training: Activities such as reading newspapers and playing games to improve concentration, memory and problem solving skills. <br> • Behavourial Therapy: Activities such as understanding the causes of negative thoughts and providing positive comments to help people with depression. <br><br> <b> 2. Users: </b> <br> Commonly used with patients with brain degeneration (such as Alzheimer's disease) and depression. <br><br> Source: <a target='_blank' href='http://www.cadenza.hk/training/pdf/ws/CTP004_cur3_ws1_s5.pdf'>The Nethersole School of Nursing, Chinese University of Hong Kong (Chinese only),</a> <a target='_blank' href='https://www.elderly.gov.hk/english/carers_corner/dementia_care/activityprogramforpersonswithdementia.html'> Department of Health </a> and <a target='_blank' href='http://webcontent.hkcss.org.hk/el/CP/behavior_guide.pdf'> The Hong Kong Council of Social Service (Chinese only) </a>",
        ch_explanation:
          "<b> 1. 甚麼來的? </b> <br> • 記憶力訓練： 透過活動(例如：回憶及背誦)訓練記憶力。<br> • 認知訓練： 透過活動(例如：讀報及玩遊戲)鍛煉患者的集中力、記憶力和解決問題能力。<br> • 行為治療： 透過活動(例如：了解負面想法及提供正面思想)協助抑鬱人士消除負面思想。<br><br> <b> 2. 使用者： </b> <br> 常用於腦退化(例如認知障礙症(前稱老人癡呆症)及抑鬱症人士。<br><br> 來源: <a target='_blank' href='http://www.cadenza.hk/training/pdf/ws/CTP004_cur3_ws1_s5.pdf'>香港中文大學那打素護理學院、</a> <a target='_blank' href='https://www.elderly.gov.hk/english/carers_corner/dementia_care/activityprogramforpersonswithdementia.html'>衛生署 </a> 及 <a target='_blank' href='http://webcontent.hkcss.org.hk/el/CP/behavior_guide.pdf'> 香港社會服務聯會 </a>",
      },
      { caregiver_type: 1, type: '2', english_title: 'Tracheostomy Care*' },
      { caregiver_type: 1, type: '2', english_title: 'Change Foley Catheter*' },
      {
        caregiver_type: 1,
        type: '2',
        english_title: 'Change SPC (Supra-pubic Catheter)*',
        en_explanation:
          '<b> 1. What is it? </b> <br> Insert the catheter into the bladder to allow urine to flow into the urine bag. <br><br> <b> 2. Users: </b> <br> Commonly used for patients with urinary incontinence, spinal injuries and lower paralysis.',
        ch_explanation:
          '<b> 1. 甚麼來的? </b> <br> 將導尿管插進膀胱令小便流進尿袋。<b> <br><br> 2. 使用者： </b> <br> 常用於小便失禁、脊骨受損及下半身癱瘓人士。',
      },

      {
        caregiver_type: 1,
        type: '2',
        english_title: 'Change Nasogastric / Gastrostomy Tube*',
      },
      { caregiver_type: 1, type: '2', english_title: 'Sputum Suction*' },
      { caregiver_type: 1, type: '2', english_title: 'Use Ventilator*' },

      // Health Worker, personal care
      {
        caregiver_type: 3,
        type: '1',
        english_title: 'Accompany to Walk Around / Do Mild Exercise',
      },
      { caregiver_type: 3, type: '1', english_title: 'Lifting' },
      { caregiver_type: 3, type: '1', english_title: 'Bathing' },

      {
        caregiver_type: 3,
        type: '1',
        english_title: 'Toileting / Change Diapers / Clean Up Excretion',
      },
      {
        caregiver_type: 3,
        type: '1',
        english_title: 'Feeding (Non-tube feeding)',
      },
      {
        caregiver_type: 3,
        type: '1',
        english_title: 'Feed Medicine',
      },
      {
        caregiver_type: 3,
        type: '1',
        english_title: 'Measure Weight / Blood Pressure / Body Temperature',
      },
      { caregiver_type: 3, type: '1', english_title: 'Oral Care' },
      {
        caregiver_type: 3,
        type: '1',
        english_title: 'Measure Blood glucose',
      },
      {
        caregiver_type: 3,
        type: '1',
        english_title: 'Insulin Injection',
      },

      // Health Worker, special care
      {
        caregiver_type: 3,
        type: '2',
        english_title: 'Oxygen Therapy',
        en_explanation:
          "<b> 1. What is it? </b> <br> Provide extra oxygen to reduce heart load. It reduces discomfort and out of breadth caused by lack of oxygen, thereby helping to improve mobility, reduce number of hospital admission, and live longer. <br><br> <b> 2. Users: </b> <br> Commonly for patients with chronic obstructive pulmonary disease (COPD) <br><br> Source: <a target='_blank' href='https://www3.ha.org.hk/ntwc/pep/2016/17.pdf'>Hospital Authority</a>",
        ch_explanation:
          "<b> 1. 甚麼來的? </b> <br> 提供額外氧氣，減低心臟負荷，亦減低因缺氧而產生的身體不適及減少氣喘。改善活動能力、減少入院次數及延長壽命。<br><br> <b> 2. 使用者： </b> <br> 常見用於患肺部或循環系統毛病人士。 <br><br> 來源： <a target='_blank' href='https://www3.ha.org.hk/ntwc/pep/2016/17.pdf'>醫院管理局</a>",
      },
      {
        caregiver_type: 3,
        type: '2',
        english_title: 'Change Urine Bags / Fecal Bags',
      },
      {
        caregiver_type: 3,
        type: '2',
        english_title: 'Stoma Care',
        en_explanation:
          "<b> 1. What is it? </b> <br> After removing parts of the colon or rectum from surgery, stoma is an artificial opening created to release fasces or urine from the intestine or urethra. <br> <br> Given that the patient cannot control excretion, it is necessary to place an ostomy bag on the stoma in order to collect excretion. <br><br> <b> 2. Users: </b> <br> Commonly in patients with colorectal cancer. <br><br> <b> 3. Causes: </b> <br> Common in patients who have a malignant tumor in rectum or anus; the rectum, anus, and sphincter have to be removed as a result. <br><br> Source: <a target='_blank' href='https://www3.ha.org.hk/pwh/patient%20edu/colostomy/ileostomy.pdf'>Hospital Authority (Chinese only),</a> <a target='_blank' href='http://www.stoma.org.hk/tc/colon_stoma'>Hong Kong Stoma Association (Chinese only),</a> and <a target='_blank' href='https://www.coloplast.com.hk/en-HK/products/Ostomy-Care/'>Colopast</a>",
        ch_explanation:
          "<b> 1. 甚麼來的? </b> <br> 造口(假肛)是在手術的過程中，將部份結腸或直腸切除後造成的人工開口，用於從腸道或尿道排放糞便或尿液。<br> 由於患者並不能控制排泄物排出，故此需要在造口位置貼上造口袋，收集排泄物。<br><br> <b> 2. 使用者： </b> <br> 常見用於大腸癌患者。<br><br> <b> 3. 成因： </b> <br> 常見是直腸或肛門有惡性腫瘤，需要將直腸，肛門及括約肌全部切除。<br><br> 來源： <a target='_blank' href='https://www3.ha.org.hk/pwh/patient%20edu/colostomy/ileostomy.pdf'>醫院管理局、</a> <a target='_blank' href='http://www.stoma.org.hk/tc/colon_stoma'>香港造口人協會、</a> 及 <a target='_blank' href='https://www.coloplast.com.hk/en-HK/products/Ostomy-Care/'>Colopast</a>",
      },
      {
        caregiver_type: 3,
        type: '2',
        english_title: 'Nasogastric Tube Feeding',
        en_explanation:
          "<b> 1. What is it? </b> <br> Tube filled with liquid diet to provide calories, nutrition and medicine to the patient. <br><br> <b> 2. Users: </b> <br> Commonly used in patients with stroke and nasopharyngeal cancer. <br><br> <b> 3. Causes: </b> Unable to eat or have swallow difficulties or have specific gastrointestinal disorders. <br><br> Source: <a target='_blank' href='https://www.chp.gov.hk/tc/wapdf/204.html?page=34'>Department of Health</a>",
        ch_explanation:
          "<b> 1. 甚麼來的? </b> <br> 用管子灌以流質食物進食以提供熱量、營養與藥物。 <br><br> <b> 2. 使用者：</b> <br> 常見用於腦中風及鼻咽癌患者。<br><br> <b> 3. 成因： </b> <br> 無法由口進食或吞嚥困難，或患特定腸胃道疾病。<br><br> 來源： <a target='_blank' href='https://www.chp.gov.hk/tc/wapdf/204.html?page=34'>衛生署</a>",
      },
      {
        caregiver_type: 3,
        type: '2',
        english_title: 'PEG Feeding / Gauze and Tape Dressing',
        en_explanation:
          "<b> 1. What is it? </b> <br> A gastrostomy is a procedure to create an artificial stoma on the stomach and abdominal wall, allowing the gastrostomy tube to be inserted directly into the stomach through the abdominal wall. The tube can then transport fluid directly to the stomach through nose and gullet. <br><br> <b> 2. Users: </b> <br> Commonly used in patients with stroke and nasopharyngeal cancer. <br><br> <b> 3. Causes: </b> <br> Unable to eat or have swallow difficulties or have specific gastrointestinal disorders. <br><br> Source: <a target='_blank' href='https://www3.ha.org.hk/ntwc/pep/2015/11.pdf'>Hospital Authority (Chinese only)</a>",
        ch_explanation:
          "<b> 1. 甚麼來的? </b> <br> 胃造口是利用手術方法在胃及腹壁上建立一個人工造口，讓胃造口導管穿過腹壁直接插入胃，不經鼻及食道輸送流質液體到胃部。<br><br> <b> 2. 使用者： </b> <br> 常見用於腦中風及鼻咽癌患者。<br><br> <b> 3. 成因： </b> <br> 無法由口進食或吞嚥困難，或患特定腸胃道疾病。 <br><br> 來源： <a target='_blank' href='https://www3.ha.org.hk/ntwc/pep/2015/11.pdf'>醫院管理局</a>",
      },
      {
        caregiver_type: 3,
        type: '2',
        english_title: 'Peritoneal Dialysis / Catheter (Soft Tube) Care',
      },
      { caregiver_type: 3, type: '2', english_title: 'Wound Care' },
      {
        caregiver_type: 3,
        type: '2',
        english_title:
          'Memory Training / Cognitive Training / Behavioural Treatment',
        en_explanation:
          "<b> 1. What is it? </b> <br> • Memory training: Activities such as recall and recitation to improve memory. <br> • Cognitive training: Activities such as reading newspapers and playing games to improve concentration, memory and problem solving skills. <br> • Behavourial Therapy: Activities such as understanding the causes of negative thoughts and providing positive comments to help people with depression. <br><br> <b> 2. Users: </b> <br> Commonly used with patients with brain degeneration (such as Alzheimer's disease) and depression. <br><br> Source: <a target='_blank' href='http://www.cadenza.hk/training/pdf/ws/CTP004_cur3_ws1_s5.pdf'>The Nethersole School of Nursing, Chinese University of Hong Kong (Chinese only),</a> <a target='_blank' href='https://www.elderly.gov.hk/english/carers_corner/dementia_care/activityprogramforpersonswithdementia.html'> Department of Health </a> and <a target='_blank' href='http://webcontent.hkcss.org.hk/el/CP/behavior_guide.pdf'> The Hong Kong Council of Social Service (Chinese only) </a>",
        ch_explanation:
          "<b> 1. 甚麼來的? </b> <br> • 記憶力訓練： 透過活動(例如：回憶及背誦)訓練記憶力。<br> • 認知訓練： 透過活動(例如：讀報及玩遊戲)鍛煉患者的集中力、記憶力和解決問題能力。<br> • 行為治療： 透過活動(例如：了解負面想法及提供正面思想)協助抑鬱人士消除負面思想。<br><br> <b> 2. 使用者： </b> <br> 常用於腦退化(例如認知障礙症(前稱老人癡呆症)及抑鬱症人士。<br><br> 來源: <a target='_blank' href='http://www.cadenza.hk/training/pdf/ws/CTP004_cur3_ws1_s5.pdf'>香港中文大學那打素護理學院、</a> <a target='_blank' href='https://www.elderly.gov.hk/english/carers_corner/dementia_care/activityprogramforpersonswithdementia.html'>衛生署 </a> 及 <a target='_blank' href='http://webcontent.hkcss.org.hk/el/CP/behavior_guide.pdf'> 香港社會服務聯會 </a>",
      },

      //  Personal Care Worker, personal care
      {
        caregiver_type: 4,
        type: '1',
        english_title: 'Accompany to Walk Around / Do Mild Exercise',
      },
      { caregiver_type: 4, type: '1', english_title: 'Lifting' },
      { caregiver_type: 4, type: '1', english_title: 'Bathing' },

      {
        caregiver_type: 4,
        type: '1',
        english_title: 'Toileting / Change Diapers / Clean Up Excretion',
      },
      {
        caregiver_type: 4,
        type: '1',
        english_title: 'Feeding (Non-tube feeding)',
      },
      {
        caregiver_type: 4,
        type: '1',
        english_title: 'Feed Medicine',
      },
      {
        caregiver_type: 4,
        type: '1',
        english_title: 'Measure Weight / Blood Pressure / Body Temperature',
      },
      { caregiver_type: 4, type: '1', english_title: 'Oral Care' },
      { caregiver_type: 4, type: '1', english_title: 'Cut Nails' },

      // Personal Care Worker, Special care
      {
        caregiver_type: 4,
        type: '2',
        english_title: 'Oxygen Therapy',
        en_explanation:
          "<b> 1. What is it? </b> <br> Provide extra oxygen to reduce heart load. It reduces discomfort and out of breadth caused by lack of oxygen, thereby helping to improve mobility, reduce number of hospital admission, and live longer. <br><br> <b> 2. Users: </b> <br> Commonly for patients with chronic obstructive pulmonary disease (COPD) <br><br> Source: <a target='_blank' href='https://www3.ha.org.hk/ntwc/pep/2016/17.pdf'>Hospital Authority</a>",
        ch_explanation:
          "<b> 1. 甚麼來的? </b> <br> 提供額外氧氣，減低心臟負荷，亦減低因缺氧而產生的身體不適及減少氣喘。改善活動能力、減少入院次數及延長壽命。<br><br> <b> 2. 使用者： </b> <br> 常見用於患肺部或循環系統毛病人士。 <br><br> 來源： <a target='_blank' href='https://www3.ha.org.hk/ntwc/pep/2016/17.pdf'>醫院管理局</a>",
      },

      //  Out-Patient Escort Person, personal care
      {
        caregiver_type: 5,
        type: '1',
        english_title: 'Accompany to Walk Around / Do Mild Exercise',
      },
      {
        caregiver_type: 5,
        type: '1',
        english_title:
          'Accompany to see Doctor / Pick up at Home / Lend an Arm / Registration / Booking / Collect Medicine',
      },
    ];

    await Database.table('skillsets').insert(skills);
  }
}

module.exports = SkillSetsSeeder;
