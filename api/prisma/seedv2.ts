import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Radinate seed...\n');

  // ------------------------------
  // 1️⃣ Seed Studies
  // ------------------------------
  console.log('🩻 Seeding studies...');
  for (let i = 1; i <= 10; i++) {
    const study_uid = `1.2.840.113619.${1000 + i}`;
    await prisma.study.upsert({
      where: { study_uid },
      update: {},
      create: {
        study_uid,
        accession: `ACC-${i}`,
        patient_age: 25 + i,
        patient_sex: i % 2 === 0 ? 'F' : 'M',
        site_id: `SITE-${(i % 3) + 1}`,
        scanner_make: 'GE Healthcare',
        scanner_model: 'Senographe Pristina',
      },
    });
  }

  // ------------------------------
  // 2️⃣ AI Outputs + Ground Truth
  // ------------------------------
  console.log('🤖 Seeding AI outputs & ground truths...');
  const studies = await prisma.study.findMany();

  for (const study of studies) {
    for (let j = 1; j <= 2; j++) {
      await prisma.aIOutput.upsert({
        where: {
          study_id_finding: {
            study_id: study.id,
            finding: `Finding-${j}`,
          },
        },
        update: {},
        create: {
          study_id: study.id,
          finding: `Finding-${j}`,
          confidence: parseFloat((Math.random() * 0.4 + 0.6).toFixed(2)),
        },
      });
    }

    await prisma.groundTruth.upsert({
      where: {
        study_id_finding: {
          study_id: study.id,
          finding: 'Finding-1',
        },
      },
      update: {},
      create: {
        study_id: study.id,
        finding: 'Finding-1',
      },
    });
  }

  // ------------------------------
  // 3️⃣ Comparison Results (Models)
  // ------------------------------
  console.log('📊 Seeding model comparison results...');
  const modelConfigs = [
    { name: 'AIModel-X', version: 'v1.0' },
    { name: 'AIModel-X', version: 'v1.1' },
    { name: 'AIModel-Y', version: 'v1.0' },
  ];

  for (const study of studies) {
    for (const model of modelConfigs) {
      await prisma.comparisonResult.create({
        data: {
          study_id: study.id,               
          study_uid: study.study_uid,
          model_name: model.name,
          model_version: model.version,
          precision: parseFloat((Math.random() * 0.1 + 0.85).toFixed(2)),
          recall: parseFloat((Math.random() * 0.1 + 0.85).toFixed(2)),
          f1_score: parseFloat((Math.random() * 0.1 + 0.85).toFixed(2)),
        },
      });
    }
  }

  // ------------------------------
  // 4️⃣ Drift Signals
  // ------------------------------
  console.log('🌪️ Seeding drift signals...');
  const features = ['age', 'sex', 'confidence'];
  for (const feature of features) {
    await prisma.driftSignal.create({
      data: {
        model_name: 'AIModel-X',
        feature,
        method: 'KS-test',
        p_value: parseFloat((Math.random() * 0.5).toFixed(3)),
        diff: parseFloat((Math.random() * 0.2).toFixed(3)),
        status: Math.random() > 0.7 ? 'drifted' : 'stable',
        window: '2025-11',
      },
    });
  }

  // ------------------------------
  // 5️⃣ Fairness Metrics
  // ------------------------------
  console.log('⚖️ Seeding fairness metrics...');
  const subgroups = ['age<40', 'age>60', 'female', 'male'];
  for (const group of subgroups) {
    await prisma.fairnessMetric.create({
      data: {
        model_name: 'AIModel-X',
        window: '2025-11',
        subgroup: group,
        precision: parseFloat((Math.random() * 0.1 + 0.85).toFixed(2)),
        recall: parseFloat((Math.random() * 0.1 + 0.85).toFixed(2)),
        f1_score: parseFloat((Math.random() * 0.1 + 0.85).toFixed(2)),
        delta: parseFloat((Math.random() * 0.2 - 0.1).toFixed(2)),
      },
    });
  }

  // ------------------------------
  // 6️⃣ Alerts
  // ------------------------------
  console.log('🚨 Seeding alerts...');
  const alertTypes = ['system', 'model', 'drift', 'fairness'];
  for (const type of alertTypes) {
    await prisma.alert.create({
      data: {
        type,
        message: `Test alert for ${type}`,
        severity: ['info', 'warning', 'critical'][Math.floor(Math.random() * 3)],
      },
    });
  }

  console.log('\n✅ Seed completed successfully!\n');
}

main()
  .catch((e) => {
    console.error(e);
    //@ts-ignore
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
