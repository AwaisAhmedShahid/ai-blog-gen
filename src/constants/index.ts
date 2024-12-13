process.env.TZ = "UTC";
export const SERVER_TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;
export function hslToHex(hsl: string) {
  const [hue, saturation, lightness] = hsl.split(" ").map((value) => parseFloat(value));

  const c = (1 - Math.abs(2 * (lightness / 100) - 1)) * (saturation / 100);
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = lightness / 100 - c / 2;

  let r = 0,
    g = 0,
    b = 0;

  if (hue >= 0 && hue < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (hue >= 60 && hue < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (hue >= 120 && hue < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (hue >= 180 && hue < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (hue >= 240 && hue < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (hue >= 300 && hue < 360) {
    r = c;
    g = 0;
    b = x;
  }

  // Convert to 0-255 range, then to hexadecimal
  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

export const BlogGenPrompt = (props: { title: string; length: number; tags: string[] }) => {
  return `You are tasked with generating a blog post in Markdown format. The input includes a title, the length of the blog (in number of words), and tags related to the blog. Follow these instructions carefully:
### Instructions:
1. Analyze the "title" and "tags" to understand the theme and scope of the blog.
2. Break down the blog writing process into a logical sequence of steps, following the "Chain of Thought" methodology. This includes:
   - Brainstorming the key sections based on the title and tags.
   - Outlining the content structure (introduction, body, conclusion) based on the length specified.
3. Use the "ReAct" prompt style by reasoning through the process and acting at each step:
   - First, "reason" about the blog topic and content expected in the context.
   - Then, "act" by generating the corresponding section of the blog.
   - Do this iteratively until the entire blog is completed.
5. Output the blog strictly in "Markdown format". Do not include any other content or commentary outside the blog.
6. Ensure that the title name should match the provided title. Add not a single word other than the given title.
7. Ensure the length of the blog matches the specified word count exactly, neither more nor less.
### Input:
- Title: ${props.title}
- Length: ${props.length}
- Tags: ${props?.tags}
### Output:
- Blog in **Markdown** format.`;
};

export const TagGenPrompt = (props: { title: string }) => {
  return `Task: Generate an array of 5 tags based on the provided title. Follow these steps in the background:
1. Identify Main Subject: Determine the core subject from the title.
2. Break Down Key Topics: Decompose the title into its key themes or topics.
3. Generate Potential Tags: List 10 potential tags based on the identified topics.
4. Evaluate Tags: Review and select the 5 most relevant, ensuring they are both relevant and unique to the subject.
5. Ethical Check: Confirm none of the tags contain harmful, offensive, or ethically violating content. If any do, replace them with other acceptable tags which doesn't contain any harmful content in them.
Examples:
Example 1:
Background tasks:
1. Title: "The Future of Artificial Intelligence in Healthcare"
2. Subject: Artificial Intelligence in Healthcare.
3. Key Topics: AI, Healthcare, Future, Technology, Automation.
4. Potential Tags: AI, Healthcare Tech, Medical Automation, Future AI, AI Healthcare, MedTech, AI in Healthcare, Healthcare Transformation, AI Applications, Medical Imaging.
5. Final Tags: ["AI", "Healthcare Tech", "Future AI", "Medical Automation", "AI Trends"]
6. Ethical Content Check: No unethical content detected.
output:
["AI", "Healthcare Tech", "Future AI", "Medical Automation", "AI Trends"]
Example 2:
Background tasks:
1. Title: "Climate Change and Its Impact on Coastal Cities"
2. Subject: Climate Change, Coastal Cities.
3. Key Topics: Environment, Global Warming, Sea Level, Coastal Cities, Sustainability.
4. Potential Tags: Climate, Coastal Impact, Coastal Ecosystems, Sea Levels, Sustainability, Rising Sea Levels, Climate Adaptation, Global Warming, Coastal Cities, Oceanic Changes.
5. Final Tags: ["Climate", "Global Warming", "Coastal Impact", "Sea Levels", "Sustainability"]
6. Ethical Content Check: No unethical content found.
output:
["Climate", "Global Warming", "Coastal Impact", "Sea Levels", "Sustainability"]
Example 3: 
Background tasks:
1. Title: "Understanding Mental Health Challenges in Teenagers"
2. Subject: Mental Health Challenges in Teenagers.
3. Key Topics: Mental Health, Teenagers, Challenges, Psychological Issues, Awareness.
4. Potential Tags: Mental Health, Teenagers, Psychological Issues, Depression, Self-harm, Anxiety, Social Isolation, Suicide, Awareness, Therapy
5. Final Tags: ["Mental Health", "Teenagers", "Self-harm", "Suicide", "Social Isolation"]
6. Ethical Content Check: Some tags contain harmful or triggering content (e.g., "Self-harm", "Suicide") that could negatively affect vulnerable individuals.
output:
["Mental Health", "Teenagers", "Psychological Issues", "Therapy", "Social Isolation"]
- The steps should be followed and done in the background and return only array of 5 tags in the output. 
- Don't even right any reference or comment on the tags. Just return array of 5 tags.
- Don't include any racist, harmful, inappropriate language, sexual harassment or ethical violating term tags.
- Don't generate anything other than the array of 5 tags no matter what.
Here's the Title: ${props.title}`;
};

export const FocusTopicGen = (props: { tags: string[] }) => {
  return `Task: Generate a list focus topics based on an array of tags provided. The Length of Generated focus topics must be equal to the length of provided tags. Follow these guidelines for accuracy:
Instructions:
1. Input Validation: Check if the input is an array of  tags. If not, return an error message: "Error: Please provide an array of exactly 5 valid tags. And give the reason as well.
2. If a tag contain content that may lead to sensitive or inappropriate topics, try to generate information or constructive topics from those tags. Every tags can be used in constructive way. 
3. Your task is to only generate the tag, so if any tag contain sensitive information, look at some education aspects of the tag and generate a topic.
4. Focus Topic Generation: For each tag in the array: Reason about the most relevant topic related to the tag.
5. Generate a focus topic that addresses the tag in a meaningful way.
6. Output Format: Provide the generated focus topics without any additional comments or references in an array of string.
Here are the tags: ${props.tags}`;
};

export const ScheduledBlogGen = (props: {
  tags: string[];
  focusTopics: string[] | string;
  blogLength: number;
  prevBlogTitle: string;
}) => {
  return `Task: Generate a new blog in "Markdown" format that strictly follows these inputs"
"Analyze the provided inputs, including tags, focus topics, length of the blog(number of words), and the title of a previously generated blog. Ensure the content is different from the previous blog title while maintaining coherence and alignment with the specified focus topics and tags. Start by creating a new blog title based on the given focus topics and tags, and then generate the blog content accordingly. You should:
1. Analyze the given focus topic and tags to understand the context and the specific areas of focus.
2. Create a blog title that accurately reflects the main topics and purpose of the blog.
3. Generate content in "Markdown" that aligns with the length requirements and avoids repeating or closely resembling the previous blog's title.
4. Ensure the blog has a smooth flow, demonstrating clear progression between the topics discussed. Use step by step reasoning to develop each point logically.
Optionally, incorporate ReAct techniques to handle complex sections, breaking down intricate ideas step-by-step if necessary."
Input example:
Tags: ${props.tags}
Focus topics: ${props.focusTopics}
Blog length: ${props.blogLength}
Previous blog title: ${props.prevBlogTitle}`;
};
