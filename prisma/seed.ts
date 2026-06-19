import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ── Super Admin: Kishor Wankhade
  const hashedKishor = await bcrypt.hash('kishor@123', 12);
  await prisma.admin.upsert({
    where: { email: 'kishor@mjhskaranja.edu.in' },
    update: { password: hashedKishor, role: 'SUPER_ADMIN', status: 'ACTIVE' },
    create: {
      name: 'Kishor Wankhade',
      email: 'kishor@mjhskaranja.edu.in',
      password: hashedKishor,
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
    },
  });
  console.log('✅ Super Admin — kishor@mjhskaranja.edu.in / kishor@123');

  // ── Staff User: staff1
  const hashedStaff = await bcrypt.hash('staff1@123', 12);
  await prisma.admin.upsert({
    where: { email: 'staff1@mjhskaranja.edu.in' },
    update: { password: hashedStaff, role: 'STAFF', status: 'ACTIVE' },
    create: {
      name: 'staff1',
      email: 'staff1@mjhskaranja.edu.in',
      password: hashedStaff,
      role: 'STAFF',
      status: 'ACTIVE',
    },
  });
  console.log('✅ Staff User  — staff1@mjhskaranja.edu.in / staff1@123');

  // Site Settings
  await prisma.siteSettings.upsert({
    where: { id: 'settings-1' },
    update: {},
    create: { id: 'settings-1', schoolName: 'M.J. High School', tagline: 'Nurturing Minds, Building Futures', address: 'Nagar Parishad Vidyalaya, Karanja Lad, Washim – 444105, Maharashtra', phone: '+91 7276-XXXXXX', email: 'info@mjhskaranja.edu.in', principalName: 'Dr. Rajesh Sharma', founded: 1965 },
  });
  console.log('✅ Site settings seeded');

  // Faculty
  const faculty = [
    { name: 'Dr. Rajesh Sharma',     designation: 'Principal',      department: 'Administration',     qualification: 'Ph.D. Education, M.Ed.', experience: 22, isFeatured: true,  order: 1 },
    { name: 'Prof. Sunita Deshmukh', designation: 'Vice Principal', department: 'Science',            qualification: 'M.Sc. Physics, B.Ed.',   experience: 18, isFeatured: true,  order: 2 },
    { name: 'Mr. Prakash Kulkarni',  designation: 'Senior Teacher', department: 'Mathematics',        qualification: 'M.Sc. Maths, B.Ed.',     experience: 15, isFeatured: false, order: 3 },
    { name: 'Mrs. Asha Patil',       designation: 'Senior Teacher', department: 'Languages',          qualification: 'M.A. Marathi, B.Ed.',    experience: 12, isFeatured: false, order: 4 },
    { name: 'Mr. Vijay Waghmare',    designation: 'Teacher',        department: 'Science',            qualification: 'M.Sc. Chemistry, B.Ed.', experience: 10, isFeatured: false, order: 5 },
    { name: 'Mrs. Rekha Jadhav',     designation: 'Teacher',        department: 'Languages',          qualification: 'M.A. English, B.Ed.',    experience: 8,  isFeatured: false, order: 6 },
    { name: 'Mr. Anil Thorat',       designation: 'Teacher',        department: 'Social Science',     qualification: 'M.A. History, B.Ed.',    experience: 11, isFeatured: false, order: 7 },
    { name: 'Mr. Suresh Gaikwad',    designation: 'Teacher',        department: 'Physical Education', qualification: 'M.P.Ed.',               experience: 9,  isFeatured: false, order: 8 },
  ];
  for (const f of faculty) {
    await prisma.faculty.create({ data: { ...f, isActive: true } }).catch(() => {});
  }
  console.log('✅ Faculty seeded');

  // Notices
  const notices = [
    { title: 'Annual Examination Schedule 2024-25',  content: 'The Annual Examination for Classes 8–10 commences March 1, 2025. Collect hall tickets from the school office.',  category: 'EXAM' as const,      status: 'PUBLISHED' as const, isPinned: true,  publishedAt: new Date('2025-01-15') },
    { title: 'Admissions Open for 2025-26',          content: 'Admissions open for Classes 8–10 for 2025-26. Last date: April 30, 2025.',                                         category: 'ADMISSION' as const, status: 'PUBLISHED' as const, isPinned: true,  publishedAt: new Date('2025-01-05') },
    { title: 'Annual Day Celebration – Feb 15',      content: 'M.J. High School Annual Day on February 15, 2025. All parents cordially invited.',                                 category: 'CULTURAL' as const,  status: 'PUBLISHED' as const, isPinned: false, publishedAt: new Date('2025-01-10') },
    { title: 'Republic Day – January 26',            content: 'Republic Day celebration on Jan 26, 2025 at 8:00 AM. All students must attend in uniform.',                        category: 'GENERAL' as const,   status: 'PUBLISHED' as const, isPinned: false, publishedAt: new Date('2025-01-20') },
    { title: 'SSC Board Form Submission Deadline',   content: 'SSC Board 2025 candidates must submit forms with documents by January 31, 2025.',                                  category: 'EXAM' as const,      status: 'PUBLISHED' as const, isPinned: false, publishedAt: new Date('2025-01-08') },
    { title: 'Inter-School Sports Competition',      content: 'M.J. High School hosts Inter-School Sports Meet on Feb 5, 2025. Registration deadline: Jan 25.',                  category: 'SPORTS' as const,    status: 'PUBLISHED' as const, isPinned: false, publishedAt: new Date('2025-01-12') },
  ];
  for (const n of notices) await prisma.notice.create({ data: n }).catch(() => {});
  console.log('✅ Notices seeded');

  // Events
  const events = [
    { title: 'Annual Day 2025',           description: 'Cultural programs, awards, and distinguished guests.',    category: 'CULTURAL' as const,  startDate: new Date('2025-02-15T09:00:00'), endDate: new Date('2025-02-15T17:00:00'), venue: 'School Auditorium',    status: 'UPCOMING' as const,  isFeatured: true  },
    { title: 'Science Exhibition 2025',   description: 'Students showcase scientific projects and innovations.',   category: 'ACADEMIC' as const,  startDate: new Date('2025-01-28T10:00:00'), endDate: new Date('2025-01-29T16:00:00'), venue: 'Science Laboratory',   status: 'UPCOMING' as const,  isFeatured: false },
    { title: 'Republic Day Celebration',  description: 'Flag hoisting, march past, and patriotic programs.',      category: 'GENERAL' as const,   startDate: new Date('2025-01-26T08:00:00'),                                          venue: 'School Grounds',       status: 'UPCOMING' as const,  isFeatured: true  },
    { title: 'Inter-School Sports Meet',  description: 'Athletics, cricket, kabaddi, and outdoor games.',          category: 'SPORTS' as const,    startDate: new Date('2025-02-05T09:00:00'), endDate: new Date('2025-02-06T17:00:00'), venue: 'School Sports Ground', status: 'UPCOMING' as const,  isFeatured: false },
    { title: 'Independence Day 2024',     description: 'Flag hoisting and cultural celebration.',                  category: 'GENERAL' as const,   startDate: new Date('2024-08-15T08:00:00'),                                          venue: 'School Grounds',       status: 'COMPLETED' as const, isFeatured: false },
  ];
  for (const e of events) await prisma.event.create({ data: e }).catch(() => {});
  console.log('✅ Events seeded');

  // Achievements
  const achievements = [
    { title: 'SSC District Topper',                   description: 'Priya Deshmukh scored 97.6% — 3rd in Washim District.', category: 'ACADEMIC' as const,  year: 2024, studentName: 'Priya Deshmukh', level: 'DISTRICT' as const,     isFeatured: true,  order: 1 },
    { title: 'District Science Olympiad – 1st Prize', description: 'Team won 1st Prize in District Level Science Olympiad.',  category: 'ACADEMIC' as const,  year: 2024,                             level: 'DISTRICT' as const,     isFeatured: true,  order: 2 },
    { title: 'State Cricket Championship – Finals',   description: 'Cricket team reached State Finals of U-17 Championship.', category: 'SPORTS' as const,    year: 2024,                             level: 'STATE' as const,        isFeatured: true,  order: 3 },
    { title: '100% SSC Board Result – 3rd Year',      description: '100% pass percentage in SSC for the 3rd consecutive year.', category: 'ACADEMIC' as const, year: 2024,                            level: 'SCHOOL' as const,       isFeatured: true,  order: 4 },
    { title: 'NTSE Scholarship',                      description: 'Two students qualified for NTSE national scholarship.',    category: 'ACADEMIC' as const,  year: 2024,                             level: 'NATIONAL' as const,     isFeatured: false, order: 5 },
    { title: 'Girls Kabaddi – State Silver Medal',    description: 'Girls Kabaddi team won Silver at State School Games.',    category: 'SPORTS' as const,    year: 2023,                             level: 'STATE' as const,        isFeatured: false, order: 6 },
    { title: 'District Cultural Festival – 1st Prize',description: '1st Prize in Natak at District Cultural Festival.',       category: 'CULTURAL' as const,  year: 2024,                             level: 'DISTRICT' as const,     isFeatured: false, order: 7 },
    { title: 'Best School Award – Washim District',   description: 'Best Secondary School Award from Washim Education Dept.', category: 'ACADEMIC' as const,  year: 2023,                             level: 'DISTRICT' as const,     isFeatured: false, order: 8 },
  ];
  for (const a of achievements) await prisma.achievement.create({ data: a }).catch(() => {});
  console.log('✅ Achievements seeded');

  // Gallery
  const album = await prisma.galleryAlbum.upsert({
    where: { id: 'album-campus' },
    update: {},
    create: { id: 'album-campus', title: 'Our Campus', description: 'School buildings, courtyard, and murals.', category: 'INFRASTRUCTURE', isPublished: true, eventDate: new Date('2024-08-01'), order: 1 },
  });
  const imgs = [
    { url: '/images/campus/campus-1.jpeg', alt: 'Main building with murals',     caption: 'Main Building & Murals',  isCover: false, order: 1 },
    { url: '/images/campus/campus-4.webp', alt: 'School entrance and nameplate', caption: 'School Entrance',         isCover: true,  order: 2 },
    { url: '/images/campus/campus-2.jpeg', alt: 'Administrative block',          caption: 'Administrative Block',    isCover: false, order: 3 },
    { url: '/images/campus/campus-3.jpeg', alt: 'Campus overview',               caption: 'Campus Overview',         isCover: false, order: 4 },
  ];
  for (const img of imgs) await prisma.galleryImage.create({ data: { ...img, albumId: album.id } }).catch(() => {});
  console.log('✅ Gallery seeded');

  console.log('\n🎉 Done!');
  console.log('   Super Admin  : kishor@mjhskaranja.edu.in  / kishor@123');
  console.log('   Staff User   : staff1@mjhskaranja.edu.in  / staff1@123');
  console.log('   Login URL    : http://localhost:3000/admin/login');
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
