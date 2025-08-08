# Vexl Ambassador Portal - Builder Guide

## Overview
The Vexl Builder is a powerful, intuitive tool for creating and editing workshop presentations. It features drag-and-drop functionality, inline editing, live preview, and seamless integration with the fork/diff/merge system.

## Getting Started

### Creating a New Presentation

1. **From Dashboard**: Click "New Presentation" button
2. **From Template**: 
   - In Strapi admin, create a presentation with title "Vexl Masterclass Template" and `isTemplate: true`
   - The system will auto-populate it with example content
   - Fork this template to create your own version

### Builder Interface

The builder has four main areas:

```
┌─────────────────────────────────────────────────┐
│  Header (Title, Fork Status, Save)             │
├────────┬────────────────────┬──────────────────┤
│        │                    │                  │
│Sections│   Block Editor     │  Live Preview   │
│  List  │                    │                  │
│        │                    │                  │
└────────┴────────────────────┴──────────────────┘
```

## Features

### 1. Section Management

**Adding Sections**
- Click the `+` button in the sections sidebar
- New sections are added at the end
- Each section starts empty

**Reordering Sections**
- Drag sections by the grip handle (⋮⋮)
- Drop to reorder
- Order is automatically saved

**Section Settings**
- **Title**: Main heading for the section
- **Subtitle**: Supporting text
- **Background**: black, dark, light, yellow, gradient
- **Transition**: fade, slide, zoom, none

**Quick Actions**
- **Duplicate**: Creates a copy with all blocks
- **Delete**: Removes section (with confirmation)

### 2. Content Blocks

Available block types:

#### Rich Text Block
- Full text editor with formatting toolbar
- Supports: Bold, Italic, Links, Lists
- Alignment options: left, center, right, justify
- Font sizes: small, medium, large, xlarge

#### Quote Block
- Highlighted quotations with attribution
- Fields: text, author, role
- Styles: default, highlight, testimonial

#### Device Mockup
- Display app screenshots in device frames
- Devices: iPhone 14 Pro, Android, Desktop, Tablet
- Orientations: Portrait, Landscape
- Includes title and caption

#### Call to Action
- Eye-catching buttons and banners
- Customizable headline, subtext, button
- Styles: primary, secondary, minimal, gradient
- Alignment control

#### Comparison Table
- Side-by-side feature comparison
- Two columns with emoji icons
- Highlight winning option
- Feature lists with checkmarks

### 3. Drag and Drop

**Section Reordering**
1. Hover over section in sidebar
2. Click and hold grip handle
3. Drag to new position
4. Release to drop

**Block Reordering**
1. Click grip handle on block
2. Drag within the same section
3. Drop to reorder

### 4. Live Preview

- Toggle with eye icon in header
- Shows real-time updates
- Accurate representation of final output
- Responsive design preview

### 5. Fork Integration

**Fork Indicators**
- Yellow "Fork" badge in header
- Shows when editing a forked presentation

**Fork Actions**
- **View Diff**: Compare with master
- **Pull Updates**: Merge changes from master

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Cmd/Ctrl + S | Save presentation |
| Cmd/Ctrl + Z | Undo |
| Cmd/Ctrl + Shift + Z | Redo |
| Cmd/Ctrl + D | Duplicate selected block |
| Delete | Delete selected block |
| Escape | Deselect block |

## Working with Forks

### Creating a Fork
1. Open any published presentation
2. Click "Fork" button
3. Edit your copy independently

### Viewing Differences
1. Open your fork in builder
2. Click "View Diff" button
3. See added/removed/modified sections

### Pulling Updates
1. Click "Pull Updates from Master"
2. Review available changes
3. Select changes to apply
4. Click "Apply Selected Changes"

## Best Practices

### Content Organization
1. **One idea per section**: Keep sections focused
2. **Visual hierarchy**: Use titles and subtitles effectively
3. **Progressive disclosure**: Build complexity gradually
4. **Call to action**: End with clear next steps

### Design Tips
1. **Consistent styling**: Use the same background for related sections
2. **Contrast**: Alternate dark and light backgrounds
3. **White space**: Don't overcrowd sections
4. **Visual interest**: Mix text with mockups and comparisons

### Performance
1. **Save regularly**: Use Cmd/Ctrl + S frequently
2. **Optimize images**: Keep screenshots under 500KB
3. **Limit blocks**: Max 10 blocks per section recommended
4. **Test preview**: Check all device sizes

## Strapi Admin Setup

### Creating Block Components

1. Navigate to Content-Type Builder
2. Create Component with category "blocks"
3. Add fields with help text:

```json
{
  "displayName": "Block Name",
  "description": "Clear description for ambassadors",
  "attributes": {
    "field": {
      "type": "string",
      "default": "Helpful default value",
      "required": false
    }
  }
}
```

### Template Creation

Create a presentation with:
- `title`: "Vexl Masterclass Template"
- `isTemplate`: true
- `isMaster`: true

The lifecycle hook will auto-populate with example content.

## Troubleshooting

### Common Issues

**Changes not saving**
- Check network connection
- Verify Clerk authentication
- Check browser console for errors

**Preview not updating**
- Toggle preview off and on
- Refresh the page
- Clear browser cache

**Drag and drop not working**
- Ensure you're clicking the grip handle
- Check for JavaScript errors
- Try different browser

**Fork conflicts**
- Use merge preview to identify conflicts
- Choose "Keep Fork" or "Take Master"
- Create backup before merging

### Getting Help

1. Check this documentation
2. Review error messages in console
3. Contact support with:
   - Browser and version
   - Steps to reproduce
   - Screenshots of issue

## API Integration

### Saving Presentations

```javascript
// Create new presentation
POST /api/strapi-proxy/presentations
{
  "data": {
    "title": "My Presentation",
    "sections": [...]
  }
}

// Update existing
PUT /api/strapi-proxy/presentations/:id
{
  "data": {
    "title": "Updated Title",
    "sections": [...]
  }
}
```

### Loading Presentations

```javascript
// Get by slug
GET /api/strapi-proxy/presentations?filters[slug][$eq]=my-presentation&populate=deep

// Response includes nested sections and blocks
{
  "data": [{
    "id": 1,
    "attributes": {
      "title": "My Presentation",
      "sections": {
        "data": [...]
      }
    }
  }]
}
```

## Version History

### v2.0 (Current)
- Drag-and-drop reordering
- Inline rich text editing
- Live preview
- Fork integration
- 5 block types
- Vexl branding

### Planned Features
- Image upload for mockups
- Video blocks
- Animations
- Presenter notes
- Export to PDF
- Collaborative editing