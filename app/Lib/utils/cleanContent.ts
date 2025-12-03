/**
 * Utility functions to clean up AI-generated lesson plan content
 * Removes HTML table/spans tags and formatting issues
 */

export interface CleanedSection {
  title: string;
  content: string[];
  type: 'header' | 'list' | 'paragraph';
}

export const cleanText = (text: string): string => {
  return text
    .replace(/_/g, ' ') // Replace underscores with spaces
    .replace(/<[^>]*>/g, '') // Remove all HTML tags
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
};

export const extractSections = (content: string): CleanedSection[] => {
  const lines = content.split('\n').map(cleanText).filter(line => line.length > 0);
  const sections: CleanedSection[] = [];
  
  let currentTitle = '';
  let currentContent: string[] = [];
  
  lines.forEach(line => {
    // Detect section headers
    const isSectionHeader = 
      line.toLowerCase().includes('introduction') ||
      line.toLowerCase().includes('development') ||
      line.toLowerCase().includes('consolidation') ||
      line.toLowerCase().includes('evaluation') ||
      line.toLowerCase().includes('generic competencies') ||
      line.toLowerCase().includes('key unity competence') ||
      line.toLowerCase().includes('topic:') ||
      line.toLowerCase().includes('duration:') ||
      line.toLowerCase().includes('objectives:') ||
      line.toLowerCase().includes('facilitation techniques:') ||
      line.toLowerCase().includes('trainer activities:') ||
      line.toLowerCase().includes('learner activities:') ||
      line.toLowerCase().includes('resources:');
    
    if (isSectionHeader) {
      // Save previous section
      if (currentTitle && currentContent.length > 0) {
        sections.push({
          title: currentTitle,
          content: currentContent,
          type: 'header'
        });
      }
      
      // Start new section
      currentTitle = line;
      currentContent = [];
    } else if (currentTitle && line.length > 0) {
      currentContent.push(line);
    }
  });
  
  // Add the last section
  if (currentTitle && currentContent.length > 0) {
    sections.push({
      title: currentTitle,
      content: currentContent,
      type: 'header'
    });
  }
  
  return sections;
};

export const formatTopicAndDuration = (text: string): { topic: string; duration: string } | null => {
  const topicMatch = text.match(/topic:\s*([^,]+)/i);
  const durationMatch = text.match(/duration:\s*(\d+)\s*minutes?/i);
  
  if (topicMatch && durationMatch) {
    return {
      topic: topicMatch[1].trim(),
      duration: durationMatch[0].trim()
    };
  }
  
  return null;
};

export const parseObjectives = (text: string): string[] => {
  const lines = text.split('\n');
  const objectives: string[] = [];
  
  lines.forEach(line => {
    const cleaned = cleanText(line);
    if (cleaned.startsWith('•') || cleaned.startsWith('-')) {
      objectives.push(cleaned.substring(1).trim());
    } else if (cleaned.length > 0 && !cleaned.toLowerCase().includes('objectives:')) {
      objectives.push(cleaned);
    }
  });
  
  return objectives;
};

export const cleanLessonPlanContent = (rawContent: string) => {
  const sections = extractSections(rawContent);
  
  const cleaned = {
    raw: rawContent,
    sections,
    metadata: {
      totalSections: sections.length,
      hasTopic: sections.some(s => s.title.toLowerCase().includes('topic')),
      hasObjectives: sections.some(s => s.title.toLowerCase().includes('objectives')),
      hasActivities: sections.some(s => s.title.toLowerCase().includes('activities'))
    }
  };
  
  return cleaned;
};

// Specific function to handle the content format provided by the user
export const processUserContent = (content: string) => {
  // First, clean the entire content
  const cleanedContent = cleanText(content);
  
  // Then extract structured data
  const topicDuration = formatTopicAndDuration(cleanedContent);
  const sections = extractSections(cleanedContent);
  
  return {
    original: content,
    cleaned: cleanedContent,
    structured: sections,
    topicDuration,
    summary: {
      totalLines: content.split('\n').length,
      cleanedLines: cleanedContent.split('\n').length,
      sectionsFound: sections.length
    }
  };
};