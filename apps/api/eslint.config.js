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
      'custom/no-comments': 'error',
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
    }
  },
  {
    files: ['src/**/*.ts', 'tests/**/*.ts'],
    ignores: ['src/services/borrowRequest.transitions.ts'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: "AssignmentExpression[left.property.name='status'], AssignmentExpression[left.property.value='status']",
          message: 'Direct assignment of status is restricted to src/services/borrowRequest.transitions.ts'
        },
        {
          selector: "VariableDeclarator[id.typeAnnotation.typeAnnotation.typeName.name='BorrowRequest'] Property[key.name='status']",
          message: 'Direct specification of status property on BorrowRequest is restricted to src/services/borrowRequest.transitions.ts'
        },
        {
          selector: "TSAsExpression[typeAnnotation.typeName.name='BorrowRequest'] Property[key.name='status']",
          message: 'Direct specification of status property on BorrowRequest is restricted to src/services/borrowRequest.transitions.ts'
        }
      ]
    }
  }
);
