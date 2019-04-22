import { Options, optionsRegexps } from './prOptions';

const regexpCols = /^(.*)(<!---? do not edit after this -?-->.*<!---? end - don't add anything after this -?-->).*$/is;
const regexpReviewflowCol = /^(\s*<!---? do not edit after this -?--><\/td><td [^>]*>)\s*(.*)\s*(<\/td><\/tr><\/table>\s*<!---? end - don't add anything after this -?-->)\s*$/is;

const parseOptions = (
  content: string,
  defaultConfig: Record<Options, boolean>,
): Record<Options, boolean> => {
  return optionsRegexps.reduce(
    (acc, { name, regexp }) => {
      const match = regexp.exec(content);
      acc[name] = !match
        ? defaultConfig[name] || false
        : match[1] === 'x' || match[2] === 'X';
      return acc;
    },
    {} as any,
  ) as Record<Options, boolean>;
};

export const parseBody = (
  description: string,
  defaultConfig: Record<Options, boolean>,
) => {
  const match = regexpCols.exec(description);
  if (!match) return null;
  const [, content, reviewFlowCol] = match;
  const reviewFlowColMatch = regexpReviewflowCol.exec(reviewFlowCol);
  if (!reviewFlowColMatch) return null;
  const [
    ,
    reviewflowContentColPrefix,
    reviewflowContentCol,
    reviewflowContentColSuffix,
  ] = reviewFlowColMatch;

  return {
    content,
    reviewflowContentColPrefix,
    reviewflowContentColSuffix,
    options: parseOptions(reviewflowContentCol, defaultConfig),
  };
};
