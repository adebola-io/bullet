declare namespace JSXUtils {
  type BooleanString = 'false' | 'true';
  type Booleanish = boolean | BooleanString;
  type NumberString = `${number}`;
  type Numberish = number | NumberString;
  export type CSSProperties = import('csstype').Properties<string | number> &
    Record<`--${string}`, string>;
  export interface DataAttributes extends Record<`data-${string}`, string> {}

  export type PickEvent<K> = K extends `on:${infer T}`
    ? T extends keyof GlobalEventHandlersEventMap
      ? GlobalEventHandlersEventMap[T]
      : never
    : never;

  export type EventHandler<E = Event> = (event: E) => void;

  export type GlobalEventAttributes = {
    [K in `on${keyof GlobalEventHandlersEventMap}`]: string;
  };

  export type JSXEventAttributes = {
    [K in `on:${keyof GlobalEventHandlersEventMap}`]:
      | EventHandler<PickEvent<K>>
      | string;
  };

  export interface GlobalAttributesMap {
    accesskey: string;
    autocapitalize:
      | 'off'
      | 'none'
      | 'on'
      | 'sentences'
      | 'words'
      | 'characters';
    autofocus: Booleanish;
    class: string;
    contenteditable: 'true' | 'false' | 'plaintext-only';
    dir: 'ltr' | 'rtl' | 'auto';
    draggable: Booleanish;
    enterkeyhint:
      | 'enter'
      | 'done'
      | 'go'
      | 'next'
      | 'previous'
      | 'search'
      | 'send';
    exportparts: string;
    hidden: Booleanish;
    id: string;
    inert: Booleanish;
    inputmode:
      | 'none'
      | 'text'
      | 'tel'
      | 'url'
      | 'email'
      | 'numeric'
      | 'decimal'
      | 'search';
    is: string;
    itemid: string;
    itemprop: string;
    itemref: string;
    itemscope: boolean;
    itemtype: string;
    lang: string;
    nonce: string;
    part: string;
    popover: Booleanish;
    role:
      | 'associationlist'
      | 'associationlistitemkey'
      | 'associationlistitemvalue'
      | 'blockquote'
      | 'caption'
      | 'code'
      | 'deletion'
      | 'emphasis'
      | 'insertion'
      | 'paragraph'
      | 'strong'
      | 'subscript'
      | 'superscript'
      | 'time'
      | 'alert'
      | 'alertdialog'
      | 'application'
      | 'article'
      | 'banner'
      | 'button'
      | 'cell'
      | 'checkbox'
      | 'columnheader'
      | 'combobox'
      | 'complementary'
      | 'contentinfo'
      | 'definition'
      | 'dialog'
      | 'directory'
      | 'document'
      | 'feed'
      | 'figure'
      | 'form'
      | 'grid'
      | 'gridcell'
      | 'group'
      | 'heading'
      | 'img'
      | 'link'
      | 'list'
      | 'listbox'
      | 'listitem'
      | 'log'
      | 'main'
      | 'marquee'
      | 'math'
      | 'menu'
      | 'menubar'
      | 'menuitem'
      | 'menuitemcheckbox'
      | 'menuitemradio'
      | 'meter'
      | 'navigation'
      | 'none'
      | 'note'
      | 'option'
      | 'presentation'
      | 'progressbar'
      | 'radio'
      | 'radiogroup'
      | 'region'
      | 'row'
      | 'rowgroup'
      | 'rowheader'
      | 'scrollbar'
      | 'search'
      | 'searchbox'
      | 'separator'
      | 'slider'
      | 'spinbutton'
      | 'status'
      | 'switch'
      | 'tab'
      | 'table'
      | 'tablist'
      | 'tabpanel'
      | 'term'
      | 'textbox'
      | 'timer'
      | 'toolbar'
      | 'tooltip'
      | 'tree'
      | 'treegrid'
      | 'treeitem';
    slot: string;
    spellcheck: Booleanish;
    style: string;
    tabindex: Numberish;
    title: string;
    translate: '' | 'yes' | 'no';
    virtualkeyboardpolicy: 'auto' | 'manual';
  }

  export type HtmlElementToAttributeMap = {
    a: {
      charset: string;
      coords: string;
      download: string;
      href: string;
      hreflang: string;
      name: string;
      ping: string;
      referrerpolicy: string;
      rel: string;
      rev: string;
      shape: string;
      target: string;
      type: string;
    };
    applet: {
      align: string;
      alt: string;
      archive: string;
      code: string;
      codebase: string;
      height: string;
      hspace: string;
      name: string;
      object: string;
      vspace: string;
      width: string;
    };
    area: {
      alt: string;
      coords: string;
      download: string;
      href: string;
      hreflang: string;
      nohref: string;
      ping: string;
      referrerpolicy: string;
      rel: string;
      shape: string;
      target: string;
      type: string;
    };
    audio: {
      autoplay: string;
      controls: string;
      crossorigin: string;
      loop: string;
      muted: string;
      preload: string;
      src: string;
    };
    base: {
      href: string;
      target: string;
    };
    basefont: {
      color: string;
      face: string;
      size: string;
    };
    blockquote: {
      cite: string;
    };
    body: {
      alink: string;
      background: string;
      bgcolor: string;
      link: string;
      text: string;
      vlink: string;
    };
    br: {
      clear: string;
    };
    button: {
      disabled: string;
      form: string;
      formaction: string;
      formenctype: string;
      formmethod: string;
      formnovalidate: string;
      formtarget: string;
      name: string;
      popovertarget: string;
      popovertargetaction: string;
      type: 'submit' | 'reset' | 'button';
      value: string;
    };
    canvas: {
      height: string;
      width: string;
    };
    caption: {
      align: string;
    };
    col: {
      align: string;
      char: string;
      charoff: string;
      span: string;
      valign: string;
      width: string;
    };
    colgroup: {
      align: string;
      char: string;
      charoff: string;
      span: string;
      valign: string;
      width: string;
    };
    data: {
      value: string;
    };
    del: {
      cite: string;
      datetime: string;
    };
    details: {
      name: string;
      open: string;
    };
    dialog: {
      open: string;
    };
    dir: {
      compact: string;
    };
    div: {
      align: string;
    };
    dl: {
      compact: string;
    };
    embed: {
      height: string;
      src: string;
      type: string;
      width: string;
    };
    fieldset: {
      disabled: string;
      form: string;
      name: string;
    };
    font: {
      color: string;
      face: string;
      size: string;
    };
    form: {
      accept: string;
      'accept-charset': string;
      action: string;
      autocomplete: string;
      enctype: string;
      method: string;
      name: string;
      novalidate: string;
      target: string;
    };
    frame: {
      frameborder: string;
      longdesc: string;
      marginheight: string;
      marginwidth: string;
      name: string;
      noresize: string;
      scrolling: string;
      src: string;
    };
    frameset: {
      cols: string;
      rows: string;
    };
    h1: {
      align: string;
    };
    h2: {
      align: string;
    };
    h3: {
      align: string;
    };
    h4: {
      align: string;
    };
    h5: {
      align: string;
    };
    h6: {
      align: string;
    };
    head: {
      profile: string;
    };
    hr: {
      align: string;
      noshade: string;
      size: string;
      width: string;
    };
    html: {
      manifest: string;
      version: string;
    };
    iframe: {
      align: string;
      allow: string;
      allowfullscreen: string;
      allowpaymentrequest: string;
      allowusermedia: string;
      frameborder: string;
      height: string;
      loading: string;
      longdesc: string;
      marginheight: string;
      marginwidth: string;
      name: string;
      referrerpolicy: string;
      sandbox: string;
      scrolling: string;
      src: string;
      srcdoc: string;
      width: string;
    };
    img: {
      align: string;
      alt: string;
      border: string;
      crossorigin: string;
      decoding: string;
      fetchpriority: string;
      height: string;
      hspace: string;
      ismap: string;
      loading: string;
      longdesc: string;
      name: string;
      referrerpolicy: string;
      sizes: string;
      src: string;
      srcset: string;
      usemap: string;
      vspace: string;
      width: string;
    };
    input: {
      accept: string;
      align: string;
      alt: string;
      autocomplete: string;
      checked: string;
      dirname: string;
      disabled: string;
      form: string;
      formaction: string;
      formenctype: string;
      formmethod: string;
      formnovalidate: string;
      formtarget: string;
      height: string;
      ismap: string;
      list: string;
      max: string;
      maxlength: string;
      min: string;
      minlength: string;
      multiple: string;
      name: string;
      pattern: string;
      placeholder: string;
      popovertarget: string;
      popovertargetaction: string;
      readonly: string;
      required: Booleanish;
      size: string;
      src: string;
      step: string;
      type:
        | 'button'
        | 'checkbox'
        | 'color'
        | 'date'
        | 'datetime'
        | 'datetime-local'
        | 'email'
        | 'file'
        | 'hidden'
        | 'image'
        | 'month'
        | 'number'
        | 'password'
        | 'radio'
        | 'range'
        | 'reset'
        | 'search'
        | 'submit'
        | 'tel'
        | 'text'
        | 'time'
        | 'url'
        | 'week';
      usemap: string;
      value: string;
      width: string;
    };
    ins: {
      cite: string;
      datetime: string;
    };
    isindex: {
      prompt: string;
    };
    label: {
      for: string;
      form: string;
    };
    legend: {
      align: string;
    };
    li: {
      type: string;
      value: string;
    };
    link: {
      as: string;
      blocking: string;
      charset: string;
      color: string;
      crossorigin: string;
      disabled: string;
      fetchpriority: string;
      href: string;
      hreflang: string;
      imagesizes: string;
      imagesrcset: string;
      integrity: string;
      media: string;
      referrerpolicy: string;
      rel: string;
      rev: string;
      sizes: string;
      target: string;
      type: string;
    };
    map: {
      name: string;
    };
    menu: {
      compact: string;
    };
    meta: {
      charset: string;
      content: string;
      'http-equiv': string;
      media: string;
      name: string;
      scheme: string;
    };
    meter: {
      high: string;
      low: string;
      max: string;
      min: string;
      optimum: string;
      value: string;
    };
    object: {
      align: string;
      archive: string;
      border: string;
      classid: string;
      codebase: string;
      codetype: string;
      data: string;
      declare: string;
      form: string;
      height: string;
      hspace: string;
      name: string;
      standby: string;
      type: string;
      typemustmatch: string;
      usemap: string;
      vspace: string;
      width: string;
    };
    ol: {
      compact: string;
      reversed: string;
      start: string;
      type: string;
    };
    optgroup: {
      disabled: string;
      label: string;
    };
    option: {
      disabled: string;
      label: string;
      selected: string;
      value: string;
    };
    output: {
      for: string;
      form: string;
      name: string;
    };
    p: {
      align: string;
    };
    param: {
      name: string;
      type: string;
      value: string;
      valuetype: string;
    };
    pre: {
      width: string;
    };
    progress: {
      max: string;
      value: string;
    };
    q: {
      cite: string;
    };
    script: {
      async: string;
      blocking: string;
      charset: string;
      crossorigin: string;
      defer: string;
      fetchpriority: string;
      integrity: string;
      language: string;
      nomodule: string;
      referrerpolicy: string;
      src: string;
      type: string;
    };
    select: {
      autocomplete: string;
      disabled: string;
      form: string;
      multiple: string;
      name: string;
      required: string;
      size: string;
    };
    slot: {
      name: string;
    };
    source: {
      height: string;
      media: string;
      sizes: string;
      src: string;
      srcset: string;
      type: string;
      width: string;
    };
    style: {
      blocking: string;
      media: string;
      type: string;
    };
    table: {
      align: string;
      bgcolor: string;
      border: string;
      cellpadding: string;
      cellspacing: string;
      frame: string;
      rules: string;
      summary: string;
      width: string;
    };
    tbody: {
      align: string;
      char: string;
      charoff: string;
      valign: string;
    };
    td: {
      abbr: string;
      align: string;
      axis: string;
      bgcolor: string;
      char: string;
      charoff: string;
      colspan: string;
      headers: string;
      height: string;
      nowrap: string;
      rowspan: string;
      scope: string;
      valign: string;
      width: string;
    };
    template: {
      shadowrootclonable: string;
      shadowrootdelegatesfocus: string;
      shadowrootmode: string;
    };
    textarea: {
      autocomplete: string;
      cols: string;
      dirname: string;
      disabled: string;
      form: string;
      maxlength: string;
      minlength: string;
      name: string;
      placeholder: string;
      readonly: string;
      required: string;
      rows: string;
      wrap: string;
    };
    tfoot: {
      align: string;
      char: string;
      charoff: string;
      valign: string;
    };
    th: {
      abbr: string;
      align: string;
      axis: string;
      bgcolor: string;
      char: string;
      charoff: string;
      colspan: string;
      headers: string;
      height: string;
      nowrap: string;
      rowspan: string;
      scope: string;
      valign: string;
      width: string;
    };
    thead: {
      align: string;
      char: string;
      charoff: string;
      valign: string;
    };
    time: {
      datetime: string;
    };
    tr: {
      align: string;
      bgcolor: string;
      char: string;
      charoff: string;
      valign: string;
    };
    track: {
      default: string;
      kind: string;
      label: string;
      src: string;
      srclang: string;
    };
    ul: {
      compact: string;
      type: string;
    };
    video: {
      autoplay: string;
      controls: string;
      crossorigin: string;
      height: string;
      loop: string;
      muted: string;
      playsinline: string;
      poster: string;
      preload: string;
      src: string;
      width: string;
    };
  };

  export type SvgElementToAttributeMap = {
    svg: {
      width: import('csstype').Property.Width;
      height: import('csstype').Property.Height;
      viewBox: string;
      preserveAspectRatio: string;
      xmlns: string;
    };
    circle: {
      cx: string;
      cy: string;
      r: string;
    };
    ellipse: {
      cx: string;
      cy: string;
      rx: string;
      ry: string;
    };
    line: {
      x1: string;
      y1: string;
      x2: string;
      y2: string;
    };
    path: {
      d: string;
    };
    polygon: {
      points: string;
    };
    polyline: {
      points: string;
    };
    rect: {
      x: string;
      y: string;
      width: string;
      height: string;
      rx: string;
      ry: string;
    };
    text: {
      x: string;
      y: string;
      dx: string;
      dy: string;
      rotate: string;
      textLength: string;
      lengthAdjust: string;
    };
    g: object;
    defs: object;
    use: {
      href: string;
      x: string;
      y: string;
      width: string;
      height: string;
    };
    clipPath: {
      clipPathUnits: string;
    };
    mask: {
      maskUnits: string;
      maskContentUnits: string;
    };
    linearGradient: {
      x1: string;
      y1: string;
      x2: string;
      y2: string;
      gradientUnits: string;
      gradientTransform: string;
    };
    radialGradient: {
      cx: string;
      cy: string;
      r: string;
      fx: string;
      fy: string;
      gradientUnits: string;
      gradientTransform: string;
    };
    stop: {
      offset: string;
      'stop-color': string;
      'stop-opacity': string;
    };
    animate: {
      attributeName: string;
      from: string;
      to: string;
      dur: string;
      repeatCount: string;
    };
    animateTransform: {
      attributeName: string;
      type: 'translate' | 'scale' | 'rotate' | 'skewX' | 'skewY';
      from: string;
      to: string;
      dur: string;
      repeatCount: string;
    };
  };

  // Common attributes for most SVG elements
  export type GlobalSVGAttributesMap = {
    fill?: string;
    stroke?: string;
    'stroke-width'?: string;
    opacity?: string;
    transform?: string;
  };
}

// ------------------------------------
// ------------------------------------
// ------------------------------------

declare namespace JSX {
  type JSXElement<U> = Omit<Partial<JSXUtils.GlobalAttributesMap>, 'style'> &
    Partial<JSXUtils.DataAttributes> &
    Partial<JSXUtils.JSXEventAttributes> &
    Partial<JSXUtils.GlobalEventAttributes> &
    Partial<
      U extends keyof JSXUtils.HtmlElementToAttributeMap
        ? JSXUtils.HtmlElementToAttributeMap[U]
        : U extends keyof JSXUtils.SvgElementToAttributeMap
        ? JSXUtils.SvgElementToAttributeMap[U] & JSXUtils.GlobalSVGAttributesMap
        : object
    > &
    JSXNativeProps;

  type JSXNativeProps = {
    children?: Node | Node[];
    key?: string | number | boolean;
    dangerouslySetInnerHTML?: { __html: string };
    style?: JSXUtils.CSSProperties | string;
  };

  type ElementTagNameMap = HTMLElementTagNameMap & SVGElementTagNameMap;

  export type IntrinsicElements = {
    [K in keyof ElementTagNameMap]: JSXElement<K>;
  } & Record<`${string}-${string}`, JSXElement<HTMLElement>>;

  export type Element = globalThis.Element;
}
