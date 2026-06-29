#!/usr/bin/env node
/**
 * {{SKILL_NAME}} — {{SKILL_TITLE}}
 * 用法: node .claude/{{SKILL_NAME}}/help.mjs
 *
 * 概述技能、核心参数、核心特性使用演示。
 * 该文件由 rui-skill 在创建技能时生成，技能作者应按需完善。
 */

import { bold, dim, cyan } from '../../lib/tty.mjs';
import { hdr, subhdr, item, scene } from '../../lib/help-layout.mjs';

const help = `
${bold("# {{SKILL_NAME}} — {{SKILL_TITLE}}")}

${dim("{{TAGLINE}}")}

${hdr("快速入门")}
${item("node .claude/{{SKILL_NAME}}/{{ENTRY_SCRIPT}} {{BASIC_ARGS}}", "{{BASIC_USAGE_DESC}}", cyan)}
{{ADDITIONAL_QUICKSTART}}

${hdr("可执行入口: node .claude/{{SKILL_NAME}}/{{ENTRY_SCRIPT}}")}

${subhdr("子命令")}
{{SUBCOMMANDS}}

${subhdr("核心参数")}
{{CORE_PARAMS}}

${hdr("核心特性演示")}
{{USAGE_SCENARIOS}}
`;

console.log(help);
