export default function transform(file, api, options) {
  const j = api.jscodeshift;
  const root = j(file.source);
  let dirtyFlag = false;

  // Find the import declaration from 'radix-vue'
  root.find(j.ImportDeclaration, { source: { value: 'radix-vue' } }).forEach(path => {
    // Check if it imports TooltipPortal, TooltipRoot, or TooltipTrigger
    const specifiers = path.node.specifiers.filter(specifier => {
      if (j.ImportSpecifier.check(specifier)) {
        const importedName = specifier.imported.name;
        return ['TooltipPortal', 'TooltipRoot', 'TooltipTrigger'].includes(importedName);
      }
      return false;
    });

    if (specifiers.length > 0) {
      // Update the import source to 'reka-ui'
      path.node.source.value = 'reka-ui';
      dirtyFlag = true;
    }
  });

  return dirtyFlag ? root.toSource() : undefined;
}