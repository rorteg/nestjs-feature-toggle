// eslint.config.js

// 1. IMPORTAÇÕES: Importamos todos os módulos necessários
// Note que você precisa ter instalado: typescript-eslint, @eslint/js, eslint-plugin-prettier e globals
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginPrettier from "eslint-plugin-prettier";
import globals from "globals"; 

export default tseslint.config(
  
  // 2. IGNORAR ARQUIVOS (Substitui o antigo .eslintignore)
  {
    ignores: ["dist/", "*.js"],
  },

  // 3. CONFIGURAÇÕES JS BASE E AMBIENTE (Substitui 'extends' e 'env')
  // Configuração JS Recomendada (Item de array)
  js.configs.recommended, 
  
  // Definições de globais (Substitui o antigo 'env: { node: true }')
  {
    languageOptions: {
      // Adiciona todas as variáveis globais do ambiente Node.js
      globals: globals.node, 
    },
  },

  // 4. CONFIGURAÇÕES TYPESCRIPT RECOMENDADAS
  // Usamos 'spread' para incluir as configurações padrão do TypeScript
  ...tseslint.configs.recommended,
  
  // 5. CONFIGURAÇÕES ESPECÍFICAS DO PROJETO (Regras, Parser e Prettier)
  {
    files: ["**/*.ts"],
    
    // Configurações de linguagem para arquivos .ts
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "tsconfig.json",
        sourceType: "module",
      },
    },

    // Mapeamento de Plugins
    plugins: {
      "prettier": eslintPluginPrettier,
    },
    
    // Regras Customizadas
    rules: {
      // Regra do Prettier para formatação
      "prettier/prettier": "error", 
      
      // Regras que estavam desligadas no seu antigo .eslintrc.js
      "@typescript-eslint/interface-name-prefix": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/ban-types": "off",
    }
  }
);