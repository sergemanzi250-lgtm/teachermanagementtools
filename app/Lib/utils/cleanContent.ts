/**
 * Utility functions to clean up AI-generated lesson plan content
 * Removes HTML table/spans tags and formatting issues
 */

export interface CleanedSection {
  title: string;
  content: string[];
  type: 'header' | 'list' | 'paragraph' | 'step' | 'activity';
  duration?: string;
  resources?: string[];
  trainerActivity?: string[];
  learnerActivity?: string[];
}

export const cleanText = (text: string): string => {
  return text
    .replace(/_/g, ' ') // Replace underscores with spaces
    .replace(/<[^>]*>/g, '') // Remove all HTML tags
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
};

export const extractSections = (content: string): CleanedSection[] => {
  const lines = content.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  const sections: CleanedSection[] = [];
  
  let currentMainSection = '';
  let currentStep = '';
  let currentContent: string[] = [];
  let currentDuration = '';
  let currentResources: string[] = [];
  let currentTrainerActivity: string[] = [];
  let currentLearnerActivity: string[] = [];
  
  const resetStepData = () => {
    currentStep = '';
    currentContent = [];
    currentDuration = '';
    currentResources = [];
    currentTrainerActivity = [];
    currentLearnerActivity = [];
  };
  
  const saveCurrentStep = () => {
    if (currentStep || currentTrainerActivity.length > 0 || currentLearnerActivity.length > 0) {
      sections.push({
        title: currentStep || `${currentMainSection} Step`,
        content: currentContent,
        type: currentStep ? 'step' : 'activity',
        duration: currentDuration,
        resources: currentResources.length > 0 ? currentResources : undefined,
        trainerActivity: currentTrainerActivity.length > 0 ? currentTrainerActivity : undefined,
        learnerActivity: currentLearnerActivity.length > 0 ? currentLearnerActivity : undefined
      });
    }
    resetStepData();
  };
  
  lines.forEach((line, index) => {
    const cleanLine = cleanText(line.replace(/\*\*/g, ''));
    
    // Detect main section headers
    if (cleanLine.toLowerCase().includes('introduction') || 
        cleanLine.toLowerCase().includes('development') ||
        cleanLine.toLowerCase().includes('conclusion')) {
      
      // Save any previous step
      saveCurrentStep();
      
      // Save any previous main section if it has content
      if (currentMainSection && sections.length > 0) {
        const lastSection = sections[sections.length - 1];
        if (!lastSection.title.toLowerCase().includes('step')) {
          sections.push({
            title: currentMainSection,
            content: currentContent,
            type: 'header'
          });
        }
      }
      
      currentMainSection = cleanLine;
      currentContent = [];
      resetStepData();
    }
    // Detect step headers
    else if (cleanLine.toLowerCase().includes('step') && cleanLine.match(/step\s+\d+/i)) {
      saveCurrentStep();
      currentStep = cleanLine;
    }
    // Detect trainer activity
    else if (cleanLine.toLowerCase().includes("trainer's activity")) {
      currentContent.push(cleanLine);
    }
    // Detect learner activity
    else if (cleanLine.toLowerCase().includes("learner's activity")) {
      currentContent.push(cleanLine);
    }
    // Extract trainer activities
    else if (cleanLine.startsWith('•') && currentContent.length > 0 && 
             currentContent[currentContent.length - 1].toLowerCase().includes("trainer's activity")) {
      currentTrainerActivity.push(cleanLine.substring(1).trim());
    }
    // Extract learner activities
    else if (cleanLine.startsWith('•') && currentContent.length > 0 && 
             currentContent[currentContent.length - 1].toLowerCase().includes("learner's activity")) {
      currentLearnerActivity.push(cleanLine.substring(1).trim());
    }
    // Extract duration
    else if (cleanLine.toLowerCase().includes('duration:')) {
      currentDuration = cleanLine;
    }
    // Extract resources
    else if (cleanLine.toLowerCase().includes('resources:')) {
      currentResources = [cleanLine];
    }
    // Add bullet points to resources
    else if (cleanLine.startsWith('•') && currentResources.length > 0) {
      currentResources.push(cleanLine.substring(1).trim());
    }
    // Add other content
    else if (cleanLine.length > 0 && !cleanLine.includes('---') && 
             !cleanLine.toLowerCase().includes('references:') &&
             !cleanLine.toLowerCase().includes('appendices:') &&
             !cleanLine.toLowerCase().includes('reflection:')) {
      currentContent.push(cleanLine);
    }
  });
  
  // Save the last step and main section
  saveCurrentStep();
  if (currentMainSection && currentContent.length > 0) {
    sections.push({
      title: currentMainSection,
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

// New function to specifically handle the user's format
export const parseLessonPlanContent = (content: string) => {
  const lines = content.split('\n').filter(line => line.trim().length > 0);
  const sections: CleanedSection[] = [];
  
  let currentSection = '';
  let currentStep = '';
  let currentActivities: string[] = [];
  let currentResources: string[] = [];
  let currentDuration = '';
  let tempContent = '';
  
  const resetStep = () => {
    currentStep = '';
    currentActivities = [];
    currentResources = [];
    currentDuration = '';
    tempContent = '';
  };
  
  const saveStep = () => {
    if (currentStep && (currentActivities.length > 0 || currentResources.length > 0 || tempContent.length > 0)) {
      sections.push({
        title: currentStep,
        content: currentActivities.length > 0 ? currentActivities : [tempContent],
        type: 'step',
        duration: currentDuration || undefined,
        resources: currentResources.length > 0 ? currentResources : undefined
      });
    }
    resetStep();
  };
  
  lines.forEach(line => {
    const trimmed = line.trim();
    const cleanLine = cleanText(trimmed.replace(/\*\*/g, ''));
    
    // Skip separator lines
    if (trimmed === '---') return;
    
    // Detect main sections
    if (trimmed.toLowerCase().includes('introduction') || 
        trimmed.toLowerCase().includes('development') ||
        trimmed.toLowerCase().includes('conclusion')) {
      
      // Save previous step
      saveStep();
      
      // Save previous main section if it has content
      if (currentSection && sections.length > 0) {
        const lastSection = sections[sections.length - 1];
        if (lastSection.type !== 'step') {
          sections.push({
            title: currentSection,
            content: [],
            type: 'header'
          });
        }
      }
      
      currentSection = trimmed;
      resetStep();
    }
    // Detect steps
    else if (trimmed.match(/^Step\s+\d+/i) || (trimmed.toLowerCase().includes('step') && trimmed.length < 30)) {
      saveStep();
      currentStep = trimmed;
    }
    // Handle pipe-separated format for resources and duration
    else if (trimmed.includes('|')) {
      const pipeParts = trimmed.split('|').map(part => part.trim());
      
      pipeParts.forEach(part => {
        if (part.toLowerCase().includes('duration:')) {
          currentDuration = part;
        } else if (part.toLowerCase().includes('resources:')) {
          // Extract resources after Resources:
          const resourcesText = part.replace(/resources:\s*/i, '');
          if (resourcesText.trim()) {
            // Split by bullet points
            const resourceItems = resourcesText.split('•')
              .map(item => item.trim())
              .filter(item => item.length > 0);
            currentResources = resourceItems;
          }
        } else if (part.length > 0 && !part.toLowerCase().includes('duration')) {
          // This is activity content
          tempContent += (tempContent ? ' ' : '') + cleanText(part);
        }
      });
    }
    // Extract duration
    else if (trimmed.toLowerCase().includes('duration:')) {
      currentDuration = trimmed;
    }
    // Extract trainer/learner activities
    else if (trimmed.includes("Trainer's activity") || trimmed.includes("Learner's activity")) {
      currentActivities.push(cleanLine);
      tempContent += (tempContent ? ' ' : '') + cleanLine;
    }
    // Extract activity bullet points
    else if (trimmed.startsWith('•') || trimmed.startsWith('-')) {
      const cleanBullet = cleanText(trimmed.substring(1).trim());
      currentActivities.push(cleanBullet);
      tempContent += (tempContent ? ' ' : '') + cleanBullet;
    }
    // Handle content with | separator format
    else if (trimmed.includes('|') && (trimmed.toLowerCase().includes('duration') || trimmed.toLowerCase().includes('resources'))) {
      const parts = trimmed.split('|').map(part => part.trim());
      parts.forEach(part => {
        if (part.toLowerCase().includes('duration:')) {
          currentDuration = part;
        } else if (part.toLowerCase().includes('resources:')) {
          currentResources = [part];
        } else if (part.length > 0) {
          currentActivities.push(cleanText(part));
          tempContent += (tempContent ? ' ' : '') + cleanText(part);
        }
      });
    }
    // Add other content
    else if (cleanLine.length > 0 && currentStep) {
      currentActivities.push(cleanLine);
      tempContent += (tempContent ? ' ' : '') + cleanLine;
    }
  });
  
  // Save the last step
  saveStep();
  
  return sections;
};

// Specific function to handle the lesson plan format provided by the user
export const processUserContent = (content: string) => {
  // Clean and normalize the content
  const cleanedContent = content
    .replace(/\r\n/g, '\n') // Normalize line endings
    .replace(/\n{3,}/g, '\n\n') // Reduce multiple line breaks
    .trim();
  
  // Extract main sections and steps
  const sections = extractSections(cleanedContent);
  
  // Extract topic and duration from the beginning
  const lines = cleanedContent.split('\n');
  let topic = '';
  let duration = '';
  
  // Look for topic and duration in the first few lines
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = cleanText(lines[i]);
    if (line.toLowerCase().includes('topic:')) {
      topic = line.replace(/topic:\s*/i, '').trim();
    }
    if (line.toLowerCase().includes('duration:')) {
      duration = line.replace(/duration:\s*/i, '').trim();
    }
  }
  
  // Group sections by main categories
  const mainSections = sections.filter(s => 
    s.type === 'header' && (
      s.title.toLowerCase().includes('introduction') ||
      s.title.toLowerCase().includes('development') ||
      s.title.toLowerCase().includes('conclusion')
    )
  );
  
  const steps = sections.filter(s => s.type === 'step');
  const activities = sections.filter(s => s.type === 'activity');
  
  return {
    original: content,
    cleaned: cleanedContent,
    structured: sections,
    metadata: {
      topic,
      duration,
      totalSections: sections.length,
      mainSections: mainSections.length,
      steps: steps.length,
      activities: activities.length,
      hasTrainerActivities: sections.some(s => s.trainerActivity && s.trainerActivity.length > 0),
      hasLearnerActivities: sections.some(s => s.learnerActivity && s.learnerActivity.length > 0),
      hasResources: sections.some(s => s.resources && s.resources.length > 0),
      hasDuration: sections.some(s => s.duration && s.duration.length > 0)
    },
    summary: {
      totalLines: content.split('\n').length,
      cleanedLines: cleanedContent.split('\n').length,
      sectionsFound: sections.length
    }
  };
};