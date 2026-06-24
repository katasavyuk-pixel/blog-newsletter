import { Callout } from "./callout";
import { GuessReveal } from "./guess-reveal";
import { Param } from "./param";
import { Quiz } from "./quiz";
import { Term } from "./term";
import { TokenizerPlayground } from "./tokenizer-playground";
import { WidgetFrame } from "./widget-frame";

/**
 * Interactive widgets available inside MDX posts. Passed straight to
 * <MDXContent components={widgets} /> — authors write <TokenizerPlayground/>,
 * <Quiz/>, <Term id="token">…</Term> etc. in markdown.
 */
export const widgets = {
  Callout,
  GuessReveal,
  Param,
  Quiz,
  Term,
  TokenizerPlayground,
  WidgetFrame,
};
