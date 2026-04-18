// Quick script to add Mathematics subject to 10-A class
import prisma from './src/core/lib/prisma.js';

async function addSubjectToClass() {
  try {
    const classId = 'cmo4jbwv40001iqmfc2gruntq'; // 10 - A
    const subjectId = 'cmo4hltdl0000iqg3stvc2o7m'; // Mathematics

    console.log('Adding Mathematics to class 10-A...');

    const classSubject = await prisma.classSubject.create({
      data: {
        classId: classId,
        subjectId: subjectId,
        teacherId: null // No teacher assigned yet
      },
      include: {
        class: { select: { name: true } },
        subject: { select: { name: true } }
      }
    });

    console.log('✅ Success!');
    console.log(`Added ${classSubject.subject.name} to ${classSubject.class.name}`);
    console.log(`ClassSubject ID: ${classSubject.id}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

addSubjectToClass();
