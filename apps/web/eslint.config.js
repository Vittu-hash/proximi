import tseslint from 'typescript-eslint';

const noCommentsPlugin = {
  rules: {
    'no-comments': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Comments are strictly forbidden across code files.'
        },
        schema: []
      },
      create(context) {
        return {
          Program() {
            const comments = context.sourceCode.getAllComments();
            for (const comment of comments) {
              context.report({
                loc: comment.loc,
                message: 'Comments are strictly forbidden.'
              });
            }
          }
        };
      }
    }
  }
};

export default tseslint.config(
  ...tseslint.configs.recommended,
  {
    plugins: {
      custom: noCommentsPlugin
    },
    rules: {
      'no-warning-comments': 'off',
      'custom/no-comments': 'error'
    }
  }
);
