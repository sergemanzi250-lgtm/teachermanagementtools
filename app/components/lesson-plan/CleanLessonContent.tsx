import React from 'react';

interface CleanLessonContentProps {
  content: string;
}

export default function CleanLessonContent({ content }: CleanLessonContentProps) {
  const stripHTML = (text: string) => {
    return text
      .replace(/_/g, ' ')
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const renderValue = (v: unknown): React.ReactNode => {
    if (Array.isArray(v)) return v.join(', ');
    const str = String(v);
    if (/<[^>]*>/.test(str)) {
      return (
        <div
          className="prose max-w-none [&_p]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
          dangerouslySetInnerHTML={{ __html: str }}
        />
      );
    }
    return stripHTML(str);
  };

  const parseSessionPlan = (text: string) => {
    if (!text || text.trim() === '') return null;

    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    const plan: Record<string, any> = {};
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
        if (!plan['Steps']) plan['Steps'] = [];
        plan['Steps'].push({
          title: currentStep,
          activities: currentActivities,
          resources: currentResources,
          duration: currentDuration,
          content: tempContent
        });
      }
      resetStep();
    };
    
    // Process each line
    lines.forEach(line => {
      const cleanLine = stripHTML(line.replace(/\*\*/g, ''));
      const lower = cleanLine.toLowerCase();
      
      // Skip separator lines
      if (cleanLine === '---') return;
      
      // Detect main sections
      if (lower.includes('sector') && lower.includes(':')) {
        const parts = line.split(':');
        plan['Sector'] = parts[1]?.trim() || '';
      } else if (lower.includes('trade') && lower.includes(':')) {
        const parts = line.split(':');
        plan['Trade'] = parts[1]?.trim() || '';
      } else if (lower.includes('level') && lower.includes(':')) {
        const parts = line.split(':');
        plan['Level'] = parts[1]?.trim() || '';
      } else if (lower.includes('trainer name') && lower.includes(':')) {
        const parts = line.split(':');
        plan['Trainer name'] = parts[1]?.trim() || '';
      } else if (lower.includes('date') && lower.includes(':')) {
        const parts = line.split(':');
        plan['Date'] = parts[1]?.trim() || '';
      } else if (lower.includes('module title') && lower.includes(':')) {
        const parts = line.split(':');
        plan['Module title'] = parts[1]?.trim() || '';
      } else if (lower.includes('weeks') && lower.includes(':')) {
        const parts = line.split(':');
        plan['Weeks'] = parts[1]?.trim() || '';
      } else if (lower.includes('trainees') && lower.includes(':')) {
        const parts = line.split(':');
        plan['No. Trainees'] = parts[1]?.trim() || '';
      } else if (lower.includes('learning outcome')) {
        currentSection = 'Learning Outcome';
        plan[currentSection] = [];
      } else if (lower.includes('indicative content')) {
        currentSection = 'Indicative content';
        plan[currentSection] = [];
      } else if (lower.includes('topic of the session')) {
        plan['Topic of the session'] = line.split(':')[1]?.trim() || line;
      } else if (lower.includes('range:')) {
        currentSection = 'Range';
        plan[currentSection] = [];
      } else if (lower.includes('objectives:')) {
        currentSection = 'Objectives';
        plan[currentSection] = [];
      } else if (lower.includes('facilitation technique')) {
        currentSection = 'Facilitation technique(s)';
        plan[currentSection] = [];
      }
      // Handle the new format sections
      else if (lower.includes('introduction')) {
        saveStep();
        currentSection = 'Introduction';
        plan[currentSection] = [];
        resetStep();
      } else if (lower.includes('development') || lower.includes('body')) {
        saveStep();
        currentSection = 'Development/Body';
        plan[currentSection] = [];
        resetStep();
      } else if (lower.includes('conclusion')) {
        saveStep();
        currentSection = 'Conclusion';
        plan[currentSection] = [];
        resetStep();
      } else if (lower.includes('evaluation of the session')) {
        saveStep();
        currentSection = 'Evaluation of the session';
        plan[currentSection] = [];
        resetStep();
      } else if (lower.includes('homework') || lower.includes('assignment')) {
        saveStep();
        currentSection = 'Homework/Assignment';
        plan[currentSection] = [];
        resetStep();
      } else if (lower.includes('references')) {
        saveStep();
        currentSection = 'References';
        plan[currentSection] = [];
        resetStep();
      } else if (lower.includes('appendices')) {
        saveStep();
        currentSection = 'Appendices';
        plan[currentSection] = [];
        resetStep();
      } else if (lower.includes('reflection')) {
        saveStep();
        currentSection = 'Reflection';
        plan[currentSection] = [];
        resetStep();
      }
      // Detect steps in the new format
      else if (cleanLine.match(/^step\s+\d+/i) || (lower.includes('step') && cleanLine.length < 30)) {
        saveStep();
        currentStep = cleanLine;
      }
      // Handle pipe-separated format for resources and duration
      else if (cleanLine.includes('|')) {
        const pipeParts = cleanLine.split('|').map(part => part.trim());
        
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
            tempContent += (tempContent ? ' ' : '') + part;
          }
        });
      }
      // Handle bullet points
      else if (cleanLine.startsWith('•') || cleanLine.startsWith('-')) {
        const cleanBullet = cleanLine.substring(1).trim();
        if (currentSection) {
          if (Array.isArray(plan[currentSection])) {
            plan[currentSection].push(cleanBullet);
          } else {
            plan[currentSection] = [cleanBullet];
          }
        } else if (currentStep) {
          currentActivities.push(cleanBullet);
        }
        tempContent += (tempContent ? ' ' : '') + cleanBullet;
      }
      // Handle trainer/learner activity markers
      else if (cleanLine.includes("Trainer's activity") || cleanLine.includes("Learner's activity")) {
        currentActivities.push(cleanLine);
        tempContent += (tempContent ? ' ' : '') + cleanLine;
      }
      // Add other content
      else if (cleanLine.length > 0) {
        if (currentSection) {
          if (Array.isArray(plan[currentSection])) {
            plan[currentSection].push(cleanLine);
          } else {
            plan[currentSection] = [cleanLine];
          }
        } else if (currentStep) {
          currentActivities.push(cleanLine);
          tempContent += (tempContent ? ' ' : '') + cleanLine;
        }
      }
    });
    
    // Save the last step
    saveStep();
    
    return plan;
  };

  const renderContent = () => {
    if (!content || content.trim() === '') {
      return <div className="text-gray-500 italic">No content available</div>;
    }

    const parsed = parseSessionPlan(content);
    
    if (!parsed || Object.keys(parsed).length === 0) {
      return <div className="text-gray-500 italic">Unable to parse content</div>;
    }

    return (
      <div className="space-y-0 border border-gray-800">
        {/* Header */}
        <div className="bg-white border-b border-gray-800 p-4 text-center">
          <h1 className="text-xl font-bold uppercase text-black">SESSION PLAN</h1>
        </div>

        {/* Info Grid */}
        <table className="w-full border-collapse">
          <tbody>
            <tr>
              <td className="border border-gray-800 px-3 py-2 font-semibold w-1/6 bg-gray-50 text-black">Sector:</td>
              <td className="border border-gray-800 px-3 py-2 w-1/6 text-black">{renderValue(parsed['Sector'] || '')}</td>
              <td className="border border-gray-800 px-3 py-2 font-semibold w-1/6 bg-gray-50 text-black">Trade:</td>
              <td className="border border-gray-800 px-3 py-2 w-1/6 text-black">{renderValue(parsed['Trade'] || '')}</td>
              <td className="border border-gray-800 px-3 py-2 font-semibold w-1/6 bg-gray-50 text-black">Level:</td>
              <td className="border border-gray-800 px-3 py-2 w-1/6 text-black">{renderValue(parsed['Level'] || '')}</td>
            </tr>
            <tr>
              <td className="border border-gray-800 px-3 py-2 font-semibold bg-gray-50 text-black">Trainer name:</td>
              <td className="border border-gray-800 px-3 py-2 text-black" colSpan={3}>{renderValue(parsed['Trainer name'] || '')}</td>
              <td className="border border-gray-800 px-3 py-2 font-semibold bg-gray-50 text-black">Date:</td>
              <td className="border border-gray-800 px-3 py-2 text-black">{renderValue(parsed['Date'] || '')}</td>
            </tr>
            <tr>
              <td className="border border-gray-800 px-3 py-2 font-semibold bg-gray-50 text-black">Module title:</td>
              <td className="border border-gray-800 px-3 py-2 text-black">{renderValue(parsed['Module title'] || '')}</td>
              <td className="border border-gray-800 px-3 py-2 font-semibold bg-gray-50 text-black">Weeks:</td>
              <td className="border border-gray-800 px-3 py-2 text-black">{renderValue(parsed['Weeks'] || '')}</td>
              <td className="border border-gray-800 px-3 py-2 font-semibold bg-gray-50 text-black">No. Trainees:</td>
              <td className="border border-gray-800 px-3 py-2 text-black">{renderValue(parsed['No. Trainees'] || '')}</td>
            </tr>
            <tr>
              <td className="border border-gray-800 px-3 py-2 font-semibold bg-gray-50 text-black">Learning Outcome</td>
              <td className="border border-gray-800 px-3 py-2 text-black" colSpan={5}>{renderValue(parsed['Learning Outcome'] || '')}</td>
            </tr>
          </tbody>
        </table>

        {/* Indicative Content */}
        {parsed['Indicative content'] && (
          <>
            <div className="border-b border-gray-800 bg-gray-100 px-3 py-2 font-semibold text-black">
              Indicative content
            </div>
            
            <table className="w-full border-collapse">
              <tbody>
                {parsed['Topic of the session'] && (
                  <tr>
                    <td className="border border-gray-800 px-3 py-2 font-semibold bg-gray-50 text-black" colSpan={2}>
                      Topic of the session: {renderValue(parsed['Topic of the session'])}
                    </td>
                  </tr>
                )}
                {parsed['Range'] && (
                  <tr>
                    <td className="border border-gray-800 px-3 py-2 w-3/4 text-black">
                      <div className="font-semibold mb-1">Range:</div>
                      <div>{renderValue(parsed['Range'])}</div>
                    </td>
                    <td className="border border-gray-800 px-3 py-2 w-1/4 text-black">
                      <div className="text-sm">Duration of the session: 40 minutes</div>
                    </td>
                  </tr>
                )}
                {parsed['Objectives'] && (
                  <tr>
                    <td className="border border-gray-800 px-3 py-2 text-black" colSpan={2}>
                      <div className="font-semibold mb-1">Objectives:</div>
                      <div>{renderValue(parsed['Objectives'])}</div>
                    </td>
                  </tr>
                )}
                {parsed['Facilitation technique(s)'] && (
                  <tr>
                    <td className="border border-gray-800 px-3 py-2 text-black" colSpan={2}>
                      <div className="font-semibold mb-1">Facilitation technique(s):</div>
                      <div>{renderValue(parsed['Facilitation technique(s)'])}</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
        )}

        {/* Introduction */}
        {parsed['Introduction'] && (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-800 px-3 py-2 text-center font-semibold text-black" colSpan={3}>Introduction</th>
              </tr>
              <tr className="bg-gray-50">
                <th className="border border-gray-800 px-3 py-2 text-left font-semibold text-black w-1/2">Activities</th>
                <th className="border border-gray-800 px-3 py-2 text-left font-semibold text-black w-1/3">Resources</th>
                <th className="border border-gray-800 px-3 py-2 text-left font-semibold text-black w-1/6">Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-800 px-3 py-2 align-top text-black">
                  {renderValue(parsed['Introduction'])}
                </td>
                <td className="border border-gray-800 px-3 py-2 align-top text-black">
                  {/* Check if we have steps with resources */}
                  {parsed['Steps'] && parsed['Steps'].some((step: any) => step.resources && step.resources.length > 0) ? (
                    parsed['Steps']
                      .filter((step: any) => step.resources && step.resources.length > 0)
                      .map((step: any, index: number) => (
                        <div key={index} className="mb-2">
                          <div className="font-semibold text-sm">{step.title}</div>
                          {step.resources.map((resource: string, resIndex: number) => (
                            <div key={resIndex} className="text-sm">• {resource}</div>
                          ))}
                        </div>
                      ))
                  ) : (
                    <span className="text-gray-400">No specific resources listed</span>
                  )}
                </td>
                <td className="border border-gray-800 px-3 py-2 align-top text-sm text-black">
                  {parsed['Steps'] && parsed['Steps'].some((step: any) => step.duration) ? (
                    parsed['Steps']
                      .filter((step: any) => step.duration)
                      .map((step: any, index: number) => (
                        <div key={index} className="mb-1">
                          <div className="font-semibold text-xs">{step.title}</div>
                          <div>{step.duration}</div>
                        </div>
                      ))
                  ) : (
                    'Not specified'
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        )}

        {/* Development/Body */}
        {parsed['Development/Body'] && (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-800 px-3 py-2 text-center font-semibold text-black" colSpan={3}>Development/Body</th>
              </tr>
              <tr className="bg-gray-50">
                <th className="border border-gray-800 px-3 py-2 text-left font-semibold text-black w-1/2">Activities</th>
                <th className="border border-gray-800 px-3 py-2 text-left font-semibold text-black w-1/3">Resources</th>
                <th className="border border-gray-800 px-3 py-2 text-left font-semibold text-black w-1/6">Duration</th>
              </tr>
            </thead>
            <tbody>
              {/* Render steps if available */}
              {parsed['Steps'] && parsed['Steps'].map((step: any, index: number) => (
                <tr key={index}>
                  <td className="border border-gray-800 px-3 py-2 align-top text-black">
                    <div className="font-semibold mb-2">{step.title}</div>
                    {step.activities && step.activities.map((activity: string, actIndex: number) => (
                      <div key={actIndex} className="mb-1">• {activity}</div>
                    ))}
                    {step.content && !step.activities && (
                      <div className="mb-1">{step.content}</div>
                    )}
                  </td>
                  <td className="border border-gray-800 px-3 py-2 align-top text-black">
                    {step.resources && step.resources.length > 0 ? (
                      step.resources.map((resource: string, resIndex: number) => (
                        <div key={resIndex} className="mb-1">• {resource}</div>
                      ))
                    ) : (
                      <span className="text-gray-400">No resources</span>
                    )}
                  </td>
                  <td className="border border-gray-800 px-3 py-2 align-top text-sm text-black">
                    {step.duration || 'Not specified'}
                  </td>
                </tr>
              ))}
              {/* Fallback to regular content if no steps */}
              {(!parsed['Steps'] || parsed['Steps'].length === 0) && (
                <tr>
                  <td className="border border-gray-800 px-3 py-2 align-top text-black" colSpan={3}>
                    {renderValue(parsed['Development/Body'])}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {/* Conclusion */}
        {parsed['Conclusion'] && (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-800 px-3 py-2 text-center font-semibold text-black" colSpan={3}>Conclusion</th>
              </tr>
              <tr className="bg-gray-50">
                <th className="border border-gray-800 px-3 py-2 text-left font-semibold text-black w-1/2">Activities</th>
                <th className="border border-gray-800 px-3 py-2 text-left font-semibold text-black w-1/3">Resources</th>
                <th className="border border-gray-800 px-3 py-2 text-left font-semibold text-black w-1/6">Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-800 px-3 py-2 text-black">
                  {renderValue(parsed['Conclusion'])}
                </td>
                <td className="border border-gray-800 px-3 py-2 align-top text-black">
                  {/* Check if we have steps with resources */}
                  {parsed['Steps'] && parsed['Steps'].some((step: any) => step.resources && step.resources.length > 0) ? (
                    parsed['Steps']
                      .filter((step: any) => step.resources && step.resources.length > 0)
                      .map((step: any, index: number) => (
                        <div key={index} className="mb-2">
                          <div className="font-semibold text-sm">{step.title}</div>
                          {step.resources.map((resource: string, resIndex: number) => (
                            <div key={resIndex} className="text-sm">• {resource}</div>
                          ))}
                        </div>
                      ))
                  ) : (
                    <span className="text-gray-400">No specific resources listed</span>
                  )}
                </td>
                <td className="border border-gray-800 px-3 py-2 align-top text-sm text-black">
                  {parsed['Steps'] && parsed['Steps'].some((step: any) => step.duration) ? (
                    parsed['Steps']
                      .filter((step: any) => step.duration)
                      .map((step: any, index: number) => (
                        <div key={index} className="mb-1">
                          <div className="font-semibold text-xs">{step.title}</div>
                          <div>{step.duration}</div>
                        </div>
                      ))
                  ) : (
                    'Not specified'
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        )}

        {/* Evaluation */}
        {parsed['Evaluation of the session'] && (
          <div className="border-t border-gray-800 px-3 py-3 text-black">
            <div className="font-semibold mb-2">Evaluation of the session:</div>
            <div>{renderValue(parsed['Evaluation of the session'])}</div>
          </div>
        )}

        {/* Homework */}
        {parsed['Homework/Assignment'] && (
          <div className="border-t border-gray-800 px-3 py-3 text-black">
            <div className="font-semibold mb-2">Homework/Assignment:</div>
            <div>{renderValue(parsed['Homework/Assignment'])}</div>
          </div>
        )}

        {/* References */}
        {parsed['References'] && (
          <div className="border-t border-gray-800 px-3 py-3 text-black">
            <div className="font-semibold mb-2">References:</div>
            <div>{renderValue(parsed['References'])}</div>
          </div>
        )}

        {/* Appendices */}
        {parsed['Appendices'] && (
          <div className="border-t border-gray-800 px-3 py-2 bg-gray-50 text-black">
            <div className="text-sm">
              <span className="font-semibold">Appendices:</span> {renderValue(parsed['Appendices'])}
            </div>
          </div>
        )}

        {/* Reflection */}
        {parsed['Reflection'] && (
          <div className="border-t border-gray-800 px-3 py-3 text-black">
            <div className="font-semibold mb-1">Reflection:</div>
            <div className="text-sm">{renderValue(parsed['Reflection'])}</div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="max-w-5xl mx-auto bg-white shadow-lg">
        {renderContent()}
      </div>
    </div>
  );
}