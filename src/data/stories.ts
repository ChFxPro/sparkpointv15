
import heleneImage from '../assets/compd/0835779aef52124bf5c00840473e8285f8e0f937.webp';
import echoesImage from '../assets/compd/e4e8c9f59f3a2b2ee1533f1f427ca4a4cb3693a5.webp';
import volunteerImpactImage from '../assets/compd/20c2a905251c86d5a4f9333b83199204b6928c7d.webp';
import { HELENE_ONE_YEAR_DATE_LABEL } from './impact2025';
import drOraTalkThumb from '../assets/moments_impact/ora1.webp';
import drOraTalkImage from '../assets/moments_impact/ora2.webp';

export interface Article {
  id: string;
  slug: string;
  title: string;
  subhead?: string;
  date: string;
  author?: string;
  excerpt: string;
  content: string; // HTML or Markdown-like string
  image?: string;
  videoUrl?: string;
}

export interface Category {
  id: string; // slug
  title: string;
  description: string;
  image: string;
  articles: Article[];
}

const ECHOES_ARTICLES: Article[] = [
  {
    id: 'week-5',
    slug: 'week-5',
    title: 'Echoes from the Community — Week 5',
    date: 'January 15, 2026',
    author: 'Olivia Hankey',
    excerpt: 'As the new year begins, echoes from across Transylvania County invite us to consider connection as something we build daily.',
    content: `
      <p class="font-bold mb-4">By Olivia Hankey<br/>SparkPoint, Transylvania County</p>
      <p>Happy New Year! Welcome back to Echoes from the Community, a column that shares insights from real stories told by residents across Transylvania County, collected through SparkPoint, a local nonprofit dedicated to strengthening community connections and well-being.</p>
      <p>As the new year begins, many of us are thinking about fresh starts. We often set goals, make plans, and look ahead. But before moving forward, it is important to reflect on the year behind us.</p>
      <p>During 2025, many neighbors across Transylvania County have shared stories from their lives through Echoes from the Community, offering insight into how connected, or disconnected, they have felt and what has mattered most during moments of challenge and change. If there is one thing we've learned through this, it's that connection changes everything.</p>
      <p>One person shared how, during a difficult season of mental health challenges, the most meaningful support they received was not advice or solutions, but someone who consistently listened. That simple act of being heard helped restore a sense of hope. Another story described an unexpected reconciliation between neighbors, sparked by a simple holiday greeting that opened the door to understanding and mutual care. What changed was not the situation, but the decision to reach out.</p>
      <p>Across many stories, similar themes emerge. Neighbors from across the county, including Brevard, Rosman, Cedar Mountain, Pisgah Forest, Connestee Falls, Little River, and Schenck Job Corps have shared their stories.</p>
      <p>Some shared they feel deeply connected to their community, while others expressed feeling isolated or unheard. Together, these voices reflect a community that values connection, even as we continue to learn how to practice it more intentionally.</p>
      <p>As we step into a new year, these echoes invite us to consider connection as something we build daily. It grows through small choices: checking in, listening fully, and noticing the people around us.</p>
      <p>Echoes from the Community encourages you to reflect on this question:</p>
      <p class="font-serif italic text-lg border-l-4 border-[#E03694] pl-4 my-6">When was the last time you felt genuinely connected to someone, and why did it happen? Maybe it came from being vulnerable, opening yourself to a new idea, or listening without the need to respond. However it showed up, what would it look like to practice it again?</p>
      <p>Share your experience online and tag SparkPoint using #YearOfConnection to be highlighted on our socials!</p>
      <p>Echoes from the Community will continue to share stories like these, highlighting what residents are saying, why it matters, and how these insights are guiding efforts to build a more connected and compassionate Transylvania County. If this kind of collaborative work appeals to you, SparkPoint is seeking community members to be trained to help analyze and reflect stories - an exciting and rewarding experience!</p>
      <p>For more information, contact <a href="mailto:maggie@yoursparkpoint.org" class="text-[#E03694] hover:underline">maggie@yoursparkpoint.org</a></p>
    `
  },
  {
    id: 'week-4',
    slug: 'week-4',
    title: 'Echoes from the Community — Week 4',
    date: 'December 11, 2025',
    author: 'Olivia Hankey',
    excerpt: 'What comes after the storm, more than anything else, is kindness. Residents share stories of being seen, understood, and met with gentleness.',
    content: `
      <p class="font-bold mb-4">By Olivia Hankey<br/>SparkPoint, Transylvania County</p>
      <h3 class="text-xl font-bold mb-4">Kindness After the Storm</h3>
      <p>Welcome back to Echoes from the Community, a column that shares insights from real stories told by residents across Transylvania County, collected through SparkPoint, a local nonprofit dedicated to strengthening community connections and well-being.</p>
      <p>In many stories collected after Hurricane Helene, people often spoke about rebuilding homes, clearing roads, or replacing what was lost. But a pattern that continuously showed up was much deeper than physical destruction. What comes after the storm, more than anything else, is kindness.</p>
      <p>Many residents shared stories that revealed a common need to be seen, understood, and met with gentleness.</p>
      <p>One community member reflected that after experiencing the hurricane, we could learn that "Instead of being upset with a person, it's likely that they just don't know. For the most part, people are good. They don't know what they don't know."</p>
      <p>Another explained, "Learning how to listen is the only way to communicate effectively."</p>
      <p>These quotes reinforce that feeling seen and understood begins with someone slowing down long enough to truly listen, which is one of the gentlest acts we can offer. And when we choose to listen, we also choose to care about what another person has to say. That care, whether it looks like offering help before being asked, giving someone grace on a hard day, or simply showing up with patience, is the heart of kindness that carried this community through the storm. It is also the same kindness that can guide us long after the storm has passed, in our everyday lives.</p>
      <p>As residents across the county reminded us, kindness is not just something that appears in moments of crisis. It is something we can practice every day. If Hurricane Helene revealed anything, it's that kindness is our strongest form of resilience and the foundation for whatever comes next.</p>
      <p>Echoes from the Community will continue to share stories like these, highlighting what residents are saying, why it matters, and how these insights are guiding efforts to build a more connected and compassionate Transylvania County. If this kind of collaborative work appeals to you, SparkPoint is seeking community members to be trained to help analyze and reflect stories - an exciting and rewarding experience!</p>
      <p>For more information, contact <a href="mailto:maggie@yoursparkpoint.org" class="text-[#E03694] hover:underline">maggie@yoursparkpoint.org</a></p>
    `
  },
  {
    id: 'week-3',
    slug: 'week-3',
    title: 'Echoes from the Community — Week 3',
    date: 'November 27, 2025',
    author: 'Olivia Hankey',
    excerpt: 'Reflecting back on Hurricane Helene, many community members shared that they miss the time they spent device-free.',
    content: `
      <p class="font-bold mb-4">By Olivia Hankey<br/>SparkPoint, Transylvania County</p>
      <h3 class="text-xl font-bold mb-4">Device Free Living Beyond the Storm</h3>
      <p>Welcome back to Echoes from the Community, a column that shares insights from real stories told by residents across Transylvania County, collected through SparkPoint, a local nonprofit dedicated to strengthening community connections and well-being.</p>
      <p>Reflecting back on Hurricane Helene, many Transylvania County community members shared that they miss the time they spent device-free when internet access, cell service, and power were limited.</p>
      <p>Others echoed this sentiment, describing how even in times of destruction and loss, without constant digital distractions, they felt more present and more connected to the people right in front of them.</p>
      <p>These reflections also offer us challenges: how might we bring a little of that simplicity into our regular routines, without waiting for a crisis like Hurricane Helene to force it? Maybe this looks like choosing one device-free meal a day, taking a short walk without a phone, or setting aside a few minutes to really listen to someone we love. Small choices like these can restore the sense of presence people say they miss.</p>
      <p>Echoes from the Community will continue to share stories like these, highlighting what residents are saying, why it matters, and how these insights are guiding efforts to build a more connected and compassionate Transylvania County. If this kind of collaborative work appeals to you, SparkPoint is seeking community members to be trained to help analyze and reflect stories - an exciting and rewarding experience!</p>
    `
  },
  {
    id: 'week-2',
    slug: 'week-2',
    title: 'Echoes from the Community — Week 2',
    date: 'November 13, 2025',
    author: 'Olivia Hankey',
    excerpt: 'The tragedy of the hurricane led many to realize they are craving deeper, more meaningful relationships not only during times of disaster, but every day.',
    content: `
      <p class="font-bold mb-4">By Olivia Hankey<br/>SparkPoint, Transylvania County</p>
      <p>Welcome back to Echoes from the Community, a column that shares insights from real stories told by residents across Transylvania County, collected through SparkPoint, a local nonprofit dedicated to strengthening community connections and well-being.</p>
      <p>After Hurricane Helene, many Transylvania county residents have expressed a need for sustained connection and preparedness beyond the crisis. While people have spoken of being prepared with supplies and trusting their neighbors during the storm, what stands out more is the shared longing to keep that spirit alive after the crisis has passed. The tragedy of the hurricane led many to realize they are craving deeper, more meaningful relationships not only during times of disaster, but every day.</p>
      <p>One community member shared that "This crisis brought out the best in our community members. Everyone was affected, and everyone wanted to help. Most people's first reaction was to reach out and help their neighbors/fellow residents. In spite of our differences, we all shared a desire to be kind and lend support wherever and whenever we could."</p>
      <p>Another reflected, "I believe that people could benefit from understanding the importance of being prepared, but more importantly, the importance of connecting with others, loving your neighbors, being willing to serve without biases, and the importance of showing up for and being present for people that are hurting." Together, these reflections point to something bigger than disaster response. They reveal an understanding that connection itself is a form of preparedness. What would life be like if we carried this same sense of connection with us every day?</p>
      <p>Echoes from the Community invites you to join a week-long challenge: find one meaningful way to connect each day - at home, at school, at work, or in town. Try something new each day. Examples of small things you could do include saying hello to someone new, sending a thank-you text, or sharing five minutes of real conversation.</p>
      <p>These acts may seem small, but they help create lasting connections.</p>
      <p>Share your experience online and tag SparkPoint using #EverydayEchoes to be highlighted on our socials!</p>
      <p>Echoes from the Community will continue to share stories like these, highlighting what residents are saying, why it matters, and how these insights are guiding efforts to build a more connected and compassionate Transylvania County. If this kind of collaborative work appeals to you, SparkPoint is seeking community members to be trained to help unpack and analyze stories - an exciting and rewarding experience!</p>
      <p>For more information, contact <a href="mailto:maggie@yoursparkpoint.org" class="text-[#E03694] hover:underline">maggie@yoursparkpoint.org</a></p>
    `
  },
  {
    id: 'week-1',
    slug: 'week-1',
    title: 'Echoes from the Community — Week 1',
    date: 'October 23, 2025',
    author: 'Olivia Hankey',
    excerpt: 'Despite the loss and hardship of the storm, many residents described feeling more connected than ever. "Together we can get through anything," one person said.',
    content: `
      <p class="font-bold mb-4">By Olivia Hankey<br/>SparkPoint, Transylvania County</p>
      <p>Welcome to Echoes from the Community! This column shares insights from real stories told by residents across Transylvania County, collected through SparkPoint, a local nonprofit dedicated to strengthening community connections and well-being. These stories are gathered, analyzed, and shared to reveal the values, concerns, and hopes that shape our collective experience as a county.</p>
      <p>In the wake of Hurricane Helene, powerful emotions surfaced during recent story-sharing sessions. Despite the loss and hardship of the storm, many residents described feeling more connected than ever. "Together we can get through anything," one person said. Another added, "Never lose hope. This region is full of heroes and helpers." Again and again, gratitude flowed toward first responders and firefighters, with one community member reflecting, "Firefighters do so much more than fight fires."</p>
      <p>Across these voices, one common need emerged: more opportunities to connect with people who are different from ourselves. It's a quiet but powerful call for understanding, curiosity, and community across the lines that often divide us. One resident shared, "When your neighbor needed help, you helped. No one asked what political party you were in or what church you went to." These reflections remind us that connection itself is a form of resilience.</p>
      <p>Echoes from the Community will continue to share stories like these, highlighting what residents are saying, why it matters, and how these insights are guiding efforts to build a more connected and compassionate Transylvania County. Over the next several weeks, this column will explore emerging themes and community perspectives gathered through SparkPoint's ongoing story collection process.</p>
      <p>If this kind of collaborative work appeals to you, SparkPoint is seeking community members to be trained to help deconstruct and analyze stories - an exciting and rewarding experience!</p>
      <p>For more information, contact <a href="mailto:maggie@yoursparkpoint.org" class="text-[#E03694] hover:underline">maggie@yoursparkpoint.org</a></p>
    `
  }
];

export const STORIES_DATA: Category[] = [
  {
    id: 'talks-lectures',
    title: 'Talks & Lectures',
    description: 'Keynotes, lectures, and community learning events hosted by SparkPoint.',
    image: drOraTalkThumb,
    articles: [
      {
        id: 'dr-ora-brain-health',
        slug: 'dr-ora-brain-health',
        title: 'Protecting Cognitive Health',
        subhead: "Dr. Ora Wells' brain health keynote on reducing the risk of cognitive decline — with a full library of books, talks, and resources to keep learning.",
        date: 'March 2025',
        author: 'Dr. Ora Wells',
        excerpt: 'SparkPoint Board President Dr. Ora Wells shares what the latest science says about protecting memory and brain health as we age — plus a curated library of books, videos, studies, and organizations to explore.',
        image: drOraTalkImage,
        videoUrl: 'https://www.youtube.com/embed/so4sCSxIgHA',
        content: `
          <p>In March 2025, hundreds of neighbors gathered at Brevard College to hear <strong>Dr. Ora Wells</strong> — SparkPoint Board President and a recently retired pediatrician — share a hopeful, evidence-based message: much of what shapes our long-term brain health is within our influence. Drawing on the latest research in lifestyle medicine and cognitive health, Dr. Wells walked the community through practical, everyday choices that support memory, focus, and resilience as we age.</p>
          <p>The full talk is above. Below is the program guide and resource library Dr. Wells assembled to help you keep learning.</p>

          <div class="my-6 rounded-2xl border border-[#E03694]/20 bg-[#FDF2F8] px-6 py-4">
            <p class="font-bold text-[#1A1A1A]">Program Guide — follow along with Dr. Wells' presentation (includes homework):</p>
            <p><a href="https://acrobat.adobe.com/id/urn:aaid:sc:US:2bdfe22d-9666-490f-8b7e-8f9f21fd9afb" target="_blank" rel="noopener noreferrer">Open the PDF (Adobe)</a> &middot; <a href="https://drive.google.com/file/d/1FHXhBnTb4rlmZ7ZhLAALbn3GVnmUbW4X/view" target="_blank" rel="noopener noreferrer">Open in Google Drive</a></p>
          </div>

          <p class="text-sm italic border-l-4 border-[#E03694] pl-4 my-6">This information is provided for educational and informational purposes only and is not medical advice. Please consult your own healthcare provider before making decisions about your health or care.</p>

          <h3>Recommended Books</h3>
          <ul>
            <li><em>Undo It!</em> — Dean &amp; Anne Ornish</li>
            <li><em>Good Energy</em> — Casey Means, MD</li>
            <li><em>The End of Alzheimer's</em> — Dale Bredesen, MD</li>
            <li><em>The Ageless Brain</em> — Dale Bredesen, MD</li>
            <li><em>Reversing Alzheimer's</em> — Heather Sandison, ND</li>
            <li><em>Doctored</em> — Sandeep Jauhar, MD</li>
            <li><em>The Alzheimer's Solution</em> — Dean &amp; Ayesha Sherzai, MD</li>
          </ul>

          <h3>Talks &amp; Videos Worth Watching</h3>
          <ul>
            <li><a href="https://youtu.be/sq4cCQf6ia4" target="_blank" rel="noopener noreferrer">Physicians Committee — Dr. Dean Ornish &amp; Dr. Neal Barnard discuss Alzheimer's research</a></li>
            <li><a href="https://youtu.be/GZzcAQqyaMY" target="_blank" rel="noopener noreferrer">Rupa Health — Dr. Casey Means: how improving your metabolism changes your life</a></li>
            <li><a href="https://youtu.be/dKDlviywVos" target="_blank" rel="noopener noreferrer">Apollo Health — how to reverse Alzheimer's &amp; cognitive decline</a></li>
            <li><a href="https://youtu.be/n4ckEq76L2g" target="_blank" rel="noopener noreferrer">Katherine Ambrose (June 2024) — reversing Alzheimer's with Dr. Heather Sandison</a></li>
            <li><a href="https://youtu.be/m6emVfRuGSc" target="_blank" rel="noopener noreferrer">Increasing brainspan and reducing Alzheimer's risk (Dr. Richard Isaacson)</a></li>
            <li><a href="https://youtu.be/50N5giJVASI" target="_blank" rel="noopener noreferrer">Integrative Family Medicine of Asheville (Dr. Brian Asbill)</a></li>
          </ul>

          <h3>Podcasts</h3>
          <ul>
            <li><a href="https://youtu.be/WqBu4O4_ERA" target="_blank" rel="noopener noreferrer">Ep. 283: Dr. Dean Ornish — Hope for Alzheimer's: the power of plant-based nutrition</a></li>
            <li><a href="https://youtu.be/3C0czhRXKRA" target="_blank" rel="noopener noreferrer">The Metabolic Link Ep. 43 — take control of your metabolic health with Dr. Casey Means</a></li>
            <li><a href="https://youtu.be/baQSf_9l-uk" target="_blank" rel="noopener noreferrer">Reversing Alzheimer's — new research on cognition &amp; brain health with Dr. Heather Sandison</a></li>
          </ul>

          <h3>Research &amp; Reports</h3>
          <ul>
            <li><a href="https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(24)01296-0/abstract" target="_blank" rel="noopener noreferrer">Dementia prevention, intervention, and care: 2024 report of the Lancet Commission</a></li>
            <li><a href="https://lifestylemedicine.org/articles/ornish-research/" target="_blank" rel="noopener noreferrer">Ornish study — lifestyle changes improve cognition in early Alzheimer's</a></li>
            <li><a href="https://proactivwellnesscenters.com/hormone-replacement/northern-virginia-bredesen-protocol-strategies-to-improve-brain-health-and-reverse-cognitive-decline-resulting-from-alzheimers/" target="_blank" rel="noopener noreferrer">Bredesen Protocol — strategies to improve brain health and reverse cognitive decline</a></li>
            <li><a href="https://pubmed.ncbi.nlm.nih.gov/37355891/" target="_blank" rel="noopener noreferrer">Sandison — observed improvement in cognition during a personalized lifestyle intervention (PubMed)</a></li>
          </ul>

          <h3>Organizations &amp; Tools</h3>
          <ul>
            <li><a href="https://www.alz.org" target="_blank" rel="noopener noreferrer">Alzheimer's Association</a></li>
            <li><a href="https://www.nia.nih.gov" target="_blank" rel="noopener noreferrer">National Institute on Aging</a></li>
            <li><a href="https://healthybrains.org" target="_blank" rel="noopener noreferrer">Cleveland Clinic Healthy Brains</a></li>
            <li><a href="https://www.apollohealthco.com" target="_blank" rel="noopener noreferrer">Apollo Health / Bredesen Protocol</a></li>
            <li><a href="https://www.virtahealth.com" target="_blank" rel="noopener noreferrer">Virta Health</a> — type 2 diabetes and metabolic health</li>
            <li><a href="https://drkellyannniotis.com" target="_blank" rel="noopener noreferrer">Dr. Kellyann Niotis</a> — preventive neurology</li>
            <li><a href="https://www.mybrainguide.org" target="_blank" rel="noopener noreferrer">MyBrainGuide</a> by UsAgainstAlzheimer's</li>
            <li><a href="https://www.brainhq.com" target="_blank" rel="noopener noreferrer">BrainHQ</a> — brain training</li>
          </ul>

          <h3>Support Communities</h3>
          <ul>
            <li><a href="https://www.caregiveraction.org" target="_blank" rel="noopener noreferrer">Caregiver Action Network</a></li>
            <li><a href="https://www.alzconnected.org" target="_blank" rel="noopener noreferrer">AlzConnected</a></li>
            <li><a href="https://www.dementiaallianceinternational.org" target="_blank" rel="noopener noreferrer">Dementia Alliance International</a></li>
          </ul>
        `
      }
    ]
  },
  {
    id: 'disaster-recovery',
    title: 'Disaster Recovery',
    description: 'Stories from the months after Helene — when recovery meant neighbors, generators, and showing up again.',
    image: heleneImage,
    articles: [
       {
        id: 'helene-one-year',
        slug: 'helene-one-year',
        title: 'Helene: One Year of Healing',
        subhead: 'A community tribute film created from more than 140 voices across Transylvania County.',
        date: HELENE_ONE_YEAR_DATE_LABEL,
        excerpt: 'A community-wide tribute film created by SparkPoint, based on interviews with over 140 residents across Transylvania County.',
        content: `
          <h3 class="text-2xl font-bold mb-6">About the Project</h3>
          <p>In the year following Hurricane Helene, SparkPoint set out to listen.</p>
          <p>In the weeks leading up to the Helene: One Year of Healing gathering, our team interviewed more than 140 people across Transylvania County — residents, volunteers, partners, and community leaders — asking a simple question: What has this year been like for you?</p>
          <p>What emerged was not a single story, but many. Stories of loss and exhaustion. Stories of generosity and resilience. Stories of neighbors meeting each other for the first time in the dark, and continuing to show up long after the lights came back on.</p>
          <p>This film is a reflection of those voices. It was created to honor the recovery journey not as a completed chapter, but as an ongoing process shaped by connection, care, and shared responsibility.</p>
          <p>Helene: One Year of Healing is offered as a tribute to the people of Transylvania County — and as a reminder that healing happens together.</p>
        `,
        image: heleneImage,
        videoUrl: 'https://www.youtube.com/embed/lHiXHz7N8Qc'
      }
    ]
  },
  {
    id: 'community-voice',
    title: 'Echoes from the Community',
    description: 'Weekly reflections gathered from conversations, circles, and shared meals across Transylvania County.',
    image: echoesImage,
    articles: ECHOES_ARTICLES
  },
  {
    id: 'volunteer-impact',
    title: 'Volunteer Impact',
    description: 'Moments where time, skill, and care turned into real change.',
    image: volunteerImpactImage,
    articles: [
      {
        id: 'community-champions',
        slug: 'community-champions',
        title: 'Community Champions',
        date: 'August 2024',
        excerpt: 'Celebrating the volunteers and partners who bring hope and action to those in need.',
        content: '<p>Behind every success story at SparkPoint are the champions who show up — the volunteers who give their time, the partners who share resources, the community leaders who open doors. These are the people who transform compassion into action, who turn vision into reality, and who remind us that together, we can achieve anything.</p>',
        image: volunteerImpactImage
      }
    ]
  }
];
