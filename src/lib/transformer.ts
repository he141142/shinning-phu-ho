type TransformerFunc<I, O> = (input: I) => O;

function compose<A, B, C>(
  f1: TransformerFunc<A, B>,
  f2: TransformerFunc<B, C>
): TransformerFunc<A, C> {
  return (input: A) => f2(f1(input));
}

// Type-safe pipeTransform (for 2–5 functions, can extend as needed)
export function pipeTransform<A, B>(f1: TransformerFunc<A, B>): TransformerFunc<A, B>;
export function pipeTransform<A, B, C>(
  f1: TransformerFunc<A, B>,
  f2: TransformerFunc<B, C>
): TransformerFunc<A, C>;
export function pipeTransform<A, B, C, D>(
  f1: TransformerFunc<A, B>,
  f2: TransformerFunc<B, C>,
  f3: TransformerFunc<C, D>
): TransformerFunc<A, D>;
export function pipeTransform<A, B, C, D, E>(
  f1: TransformerFunc<A, B>,
  f2: TransformerFunc<B, C>,
  f3: TransformerFunc<C, D>,
  f4: TransformerFunc<D, E>
): TransformerFunc<A, E>;
export function pipeTransform(...fns: TransformerFunc<any, any>[]): TransformerFunc<any, any> {
  if (fns.length === 0) throw new Error("pipeTransform requires at least one function");
  if (fns.length === 1) return fns[0];
  return fns.reduce((f1, f2) => compose(f1, f2));
}


type NodeDTO = {
    id: string;
    name: string;
    content_ref: string;
    node_type: "VIDEO" | "ARTICLE";
};

type Node = {
    id: string;
    title: string;
    contentRef: string;
    type: "video" | "article";
};

type NodeViewModel = {
    id: string;
    label: string;
    icon: string;
};


const dtoToDomain: TransformerFunc<NodeDTO, Node> = (dto) => ({
  id: dto.id,
  title: dto.name,
  contentRef: dto.content_ref,
  type: dto.node_type.toLowerCase() as Node["type"],
});

const domainToViewModel: TransformerFunc<Node, NodeViewModel> = (node) => ({
  id: node.id,
  label: node.title,
  icon: node.type === "video" ? "🎥" : "📄",
});

const dtoToViewModel = pipeTransform(dtoToDomain, domainToViewModel);

const result = dtoToViewModel({
  id: "1",
  name: "Intro Video",
  content_ref: "x",
  node_type: "VIDEO",
}); // ✅ fully typed result: NodeViewModel


export { type TransformerFunc };