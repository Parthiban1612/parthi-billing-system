import React from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';

// Helper function to parse HTML tags and convert to React Native components
export const parseHtmlToReactNative = (htmlString) => {
  if (!htmlString || typeof htmlString !== 'string') {
    return <Text>No content available</Text>;
  }

  // Remove DOCTYPE, html, head, and body tags, keep only the content
  let content = htmlString
    .replace(/<!DOCTYPE[^>]*>/gi, '')
    .replace(/<html[^>]*>/gi, '')
    .replace(/<\/html>/gi, '')
    .replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '')
    .replace(/<body[^>]*>/gi, '')
    .replace(/<\/body>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');

  // Parse the content
  const elements = parseHtmlContent(content);
  
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {elements}
      </View>
    </ScrollView>
  );
};

const parseHtmlContent = (html) => {
  const elements = [];
  let currentIndex = 0;

  while (currentIndex < html.length) {
    const tagMatch = html.substring(currentIndex).match(/<(\/?)([a-zA-Z][a-zA-Z0-9]*)[^>]*>/);
    
    if (!tagMatch) {
      // No more tags, add remaining text
      const remainingText = html.substring(currentIndex).trim();
      if (remainingText) {
        elements.push(parseText(remainingText));
      }
      break;
    }

    const [fullMatch, isClosing, tagName] = tagMatch;
    const tagStart = currentIndex + html.substring(currentIndex).indexOf(fullMatch);
    
    // Add text before the tag
    const textBeforeTag = html.substring(currentIndex, tagStart).trim();
    if (textBeforeTag) {
      elements.push(parseText(textBeforeTag));
    }

    if (isClosing) {
      // Handle closing tags
      currentIndex = tagStart + fullMatch.length;
      continue;
    }

    // Handle opening tags
    const tagEnd = html.indexOf('>', tagStart);
    const tagContent = html.substring(tagStart, tagEnd + 1);
    
    // Find the content and closing tag
    const contentStart = tagEnd + 1;
    const closingTagPattern = new RegExp(`</${tagName}>`, 'i');
    const closingMatch = html.substring(contentStart).match(closingTagPattern);
    
    if (closingMatch) {
      const contentEnd = contentStart + html.substring(contentStart).indexOf(closingMatch[0]);
      const innerContent = html.substring(contentStart, contentEnd);
      
      const element = createElement(tagName, tagContent, innerContent);
      if (element) {
        elements.push(element);
      }
      
      currentIndex = contentEnd + closingMatch[0].length;
    } else {
      // Self-closing tag
      const element = createElement(tagName, tagContent, '');
      if (element) {
        elements.push(element);
      }
      currentIndex = tagEnd + 1;
    }
  }

  return elements;
};

const createElement = (tagName, tagContent, innerContent) => {
  const props = parseAttributes(tagContent);
  
  switch (tagName.toLowerCase()) {
    case 'div':
      const divStyle = [];
      if (props.className === 'content') {
        divStyle.push(styles.content);
      } else if (props.className === 'section') {
        divStyle.push(styles.section);
      } else if (props.className === 'list-container') {
        divStyle.push(styles.listContainer);
      } else if (props.className === 'list-item') {
        divStyle.push(styles.listItem);
      } else if (props.className === 'last-updated') {
        divStyle.push(styles.lastUpdated);
      }
      
      return (
        <View key={Math.random()} style={divStyle}>
          {innerContent ? parseHtmlContent(innerContent) : null}
        </View>
      );
    
    case 'h2':
      return (
        <Text key={Math.random()} style={styles.sectionTitle}>
          {parseText(innerContent)}
        </Text>
      );
    
    case 'p':
      const pStyle = [];
      if (props.className === 'section-description') {
        pStyle.push(styles.sectionDescription);
      } else if (props.className === 'section-subtitle') {
        pStyle.push(styles.sectionSubtitle);
      }
      
      return (
        <Text key={Math.random()} style={pStyle}>
          {parseText(innerContent)}
        </Text>
      );
    
    case 'a':
      return (
        <Text key={Math.random()} style={styles.link}>
          {parseText(innerContent)}
        </Text>
      );
    
    case 'span':
      if (props.className === 'list-arrow') {
        return <Text key={Math.random()} style={styles.listArrow}>→</Text>;
      } else if (props.className === 'list-text') {
        return <Text key={Math.random()} style={styles.listText}>{parseText(innerContent)}</Text>;
      }
      return <Text key={Math.random()}>{parseText(innerContent)}</Text>;
    
    default:
      return null;
  }
};

const parseText = (text) => {
  if (!text) return '';
  
  // Decode HTML entities
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .trim();
};

const parseAttributes = (tagContent) => {
  const props = {};
  const classMatch = tagContent.match(/class=["']([^"']*)["']/);
  if (classMatch) {
    props.className = classMatch[1];
  }
  return props;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6F9',
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '600',
    marginBottom: 10,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginTop: 8,
    color: '#000000',
    fontWeight: '500',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: 'rgb(102, 102, 102)',
    lineHeight: 20,
    fontWeight: '400',
    textAlign: 'justify',
    marginBottom: 8,
  },
  link: {
    color: '#6f27ff',
    textDecorationLine: 'underline',
  },
  listContainer: {
    marginTop: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 8,
    marginLeft: 16,
  },
  listArrow: {
    color: 'rgb(102, 102, 102)',
    marginRight: 8,
    marginTop: 6,
    opacity: 0.7,
    fontSize: 10,
  },
  listText: {
    fontSize: 14,
    color: 'rgb(102, 102, 102)',
    flex: 1,
    lineHeight: 20,
    fontWeight: '400',
    textAlign: 'justify',
  },
  lastUpdated: {
    fontSize: 13,
    color: '#000000',
    opacity: 0.5,
    fontWeight: '400',
    marginBottom: 16,
    marginTop: 20,
  },
});
