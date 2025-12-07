import { db } from '../lib/db';
import { ideas } from '../lib/db/schema';

async function main() {
  const result = await db.select({ 
    id: ideas.id, 
    title: ideas.title, 
    score: ideas.aiScore 
  }).from(ideas);
  
  console.log('\n=== AI SCORES ===\n');
  result.forEach(r => {
    console.log(`${r.score} - ${r.title}`);
  });
  console.log('\n');
  process.exit(0);
}

main();
