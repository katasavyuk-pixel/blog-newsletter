import { Callout } from "./callout";
import { CostCalculator } from "./cost-calculator";
import { GuessReveal } from "./guess-reveal";
import { HallucinationQuiz } from "./hallucination-quiz";
import { LifeOfAPrompt } from "./life-of-a-prompt";
import { Param } from "./param";
import { PromptDiff } from "./prompt-diff";
import { Quiz } from "./quiz";
import { RadarItem } from "./radar-item";
import { TemperatureSandbox } from "./temperature-sandbox";
import { Term } from "./term";
import { TokenizerPlayground } from "./tokenizer-playground";
import { WidgetFrame } from "./widget-frame";
import { YouTubeEmbed } from "./youtube-embed";

/**
 * Interactive widgets available inside MDX posts. Passed straight to
 * <MDXContent components={widgets} /> — authors write <TokenizerPlayground/>,
 * <Quiz/>, <Term id="token">…</Term> etc. in markdown.
 */
export const widgets = {
  Callout,
  CostCalculator,
  GuessReveal,
  HallucinationQuiz,
  LifeOfAPrompt,
  Param,
  PromptDiff,
  Quiz,
  RadarItem,
  TemperatureSandbox,
  Term,
  TokenizerPlayground,
  WidgetFrame,
  YouTubeEmbed,
};
