import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Radinate seed process...\n');

  // ------------------------------
  // 1️⃣ Create Roles
  // ------------------------------
  console.log('👥 Seeding roles...');
  const roles = ['CMIO', 'Chief Risk Officer', 'CFO', 'Radiology Lead'];

  for (const name of roles) {
    await prisma.rBACRole.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  // ------------------------------
  // 2️⃣ Create Users
  // ------------------------------
  console.log('👤 Seeding users...');
  const cmioRole = await prisma.rBACRole.findUnique({ where: { name: 'CMIO' } });
  const croRole = await prisma.rBACRole.findUnique({ where: { name: 'Chief Risk Officer' } });
  const cfoRole = await prisma.rBACRole.findUnique({ where: { name: 'CFO' } });
  const radLeadRole = await prisma.rBACRole.findUnique({ where: { name: 'Radiology Lead' } });
  const hashed = await bcrypt.hash('changeme123', 10);
  await prisma.rBACUser.upsert({
    where: { email: 'cmio@radinate.com' },
    update: {},
    create: {
      email: 'cmio@radinate.com',
      password: hashed,
      role_id: cmioRole!.id,
    },
  });

  await prisma.rBACUser.upsert({
    where: { email: 'cro@radinate.com' },
    update: {},
    create: {
      email: 'cro@radinate.com',
      password: hashed,
      role_id: croRole!.id,
    },
  });

  await prisma.rBACUser.upsert({
    where: { email: 'cfo@radinate.com' },
    update: {},
    create: {
      email: 'cfo@radinate.com',
      password: hashed,
      role_id: cfoRole!.id,
    },
  });

  await prisma.rBACUser.upsert({
    where: { email: 'radiologylead@radinate.com' },
    update: {},
    create: {
      email: 'radiologylead@radinate.com',
      password: hashed,
      role_id: radLeadRole!.id,
    },
  });

  // ------------------------------
  // 3️⃣ Studies + AI Outputs + Ground Truths
  // ------------------------------
  console.log('🩻 Seeding studies, AI outputs & ground truths...');
  for (let i = 1; i <= 10; i++) {
    const study_uid = `1.2.840.113619.${1000 + i}`;
    const study = await prisma.study.upsert({
      where: { study_uid },
      update: {},
      create: {
        study_uid,
        accession: `ACC-${i}`,
        patient_age: 30 + i,
        patient_sex: i % 2 === 0 ? 'F' : 'M',
        site_id: `SITE-${(i % 3) + 1}`,
        scanner_make: 'GE Healthcare',
        scanner_model: 'Senographe Pristina',
      },
    });

    for (let j = 1; j <= 3; j++) {
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
  // 4️⃣ Comparison Results
  // ------------------------------
  console.log('📊 Seeding comparison results...');
  const studies = await prisma.study.findMany();
  for (const study of studies) {
    await prisma.comparisonResult.create({
      data: {
        study_id: study.id,  
        study_uid: study.study_uid,
        model_name: 'AIModel-X',
        model_version: 'v1.0',
        precision: 0.91,
        recall: 0.88,
        f1_score: 0.89,
      },
    });
  }
  // 6️⃣ Metrics Time Series
  console.log('📈 Seeding metrics time series...');

  const modelConfigs = [
    { name: 'AIModel-X', version: 'v1.0' },
    { name: 'AIModel-Y', version: 'v2.0' },
  ];

  for (const model of modelConfigs) {
    // 12 data points (~monthly metrics)
    for (let month = 1; month <= 12; month++) {
      const date = new Date(2025, month - 1, 15); // 15th of each month

      await prisma.metricsTimeSeries.create({
        data: {
          model_name: model.name,
          model_version: model.version,
          window: `${2025}-${month.toString().padStart(2, '0')}`,
          precision: parseFloat((Math.random() * 0.1 + 0.85).toFixed(3)),
          recall: parseFloat((Math.random() * 0.1 + 0.8).toFixed(3)),
          f1_score: parseFloat((Math.random() * 0.1 + 0.83).toFixed(3)),
          auc_roc: parseFloat((Math.random() * 0.1 + 0.9).toFixed(3)),
          auc_pr: parseFloat((Math.random() * 0.1 + 0.88).toFixed(3)),
          ppv: parseFloat((Math.random() * 0.1 + 0.84).toFixed(3)),
          npv: parseFloat((Math.random() * 0.1 + 0.82).toFixed(3)),
          prevalence: parseFloat((Math.random() * 0.05 + 0.1).toFixed(3)),
          ece: parseFloat((Math.random() * 0.05).toFixed(3)),
          n: Math.floor(Math.random() * 500 + 500),
          computed_at: date,
        },
      });
    }
  }

  console.log('✅ Metrics time series seeded successfully.');



    // 8️⃣ Drift Metrics Summary
  console.log('📊 Seeding drift metrics summary...');

  const driftSummaryModels = [
    { name: 'AIModel-X', version: 'v1.0' },
    { name: 'AIModel-Y', version: 'v2.0' },
  ];

  for (const model of driftSummaryModels) {
    const totalFeatures = 10;
    const driftedFeatures = Math.floor(Math.random() * 5);
    const avgPValue = parseFloat((Math.random() * 0.3).toFixed(3));
    const driftRate = parseFloat(
      (driftedFeatures / totalFeatures).toFixed(3)
    );

    await prisma.driftMetric.create({
      data: {
        model_name: model.name,
        model_version: model.version,
        window: '2025-11',
        total_features: totalFeatures,
        drifted_features: driftedFeatures,
        drift_rate: driftRate,
        avg_p_value: avgPValue,
      },
    });
  }

  console.log('✅ Drift metrics seeded successfully.');


  // ------------------------------
  // 5️⃣ Drift Signals
  // ------------------------------
  console.log('📈 Seeding drift signals...');
  const features = ['age', 'sex', 'scanner_model', 'confidence'];
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
  // 6️⃣ Fairness Metrics
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
  // 7️⃣ Alerts
  // ------------------------------
  console.log('🚨 Seeding alerts...');
  const alertTypes = ['system', 'model', 'fairness', 'drift'];
  for (const type of alertTypes) {
    await prisma.alert.create({
      data: {
        type,
        message: `Test alert for ${type}`,
        severity: ['info', 'warning', 'critical'][Math.floor(Math.random() * 3)],
      },
    });
  }

  console.log('\n✅ Seed completed successfully.');
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
