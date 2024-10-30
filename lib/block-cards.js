(function (blocks, blockEditor, element, components) {
    var __ = wp.i18n.__;
    var el = element.createElement;
    var RichText = blockEditor.RichText;
    var CheckboxControl = components.CheckboxControl;
    var InnerBlocks = blockEditor.InnerBlocks;
    var InspectorControls = blockEditor.InspectorControls;
    var PanelBody = components.PanelBody;
    var ColorPalette = components.ColorPalette;

    // card
    blocks.registerBlockType('liquid/card', {
        title: __('Card', 'liquid-blocks'),
        icon: 'text',
        category: 'liquid',

        attributes: {
            contentTop: {
                type: 'string',
                source: 'html',
                selector: '.liquid-card-top'
            },
            textColor: {
                type: 'string',
                default: '#333333',
            },
            backgroundColor: {
                type: 'string',
                default: '#00aeef',
            },
            borderColor: {
                type: 'string',
                default: '#00aeef',
            },
        },
        example: {
            attributes: {
                contentTop: 'Title',
            }
        },

        edit: function (props) {
            var setAttributes = props.setAttributes;
            var contentTop = props.attributes.contentTop;
            var textColor = props.attributes.textColor;
            var backgroundColor = props.attributes.backgroundColor;
            var borderColor = props.attributes.borderColor;

            return [
                el(InspectorControls, null,
                    el(PanelBody, { title: __('Card Settings', 'liquid-blocks'), initialOpen: true },
                        el('p', {}, __('Text Color', 'liquid-blocks')),
                        el(ColorPalette, {
                            value: textColor,
                            onChange: (newVal) => setAttributes({ textColor: newVal }),
                        }),
                        el('p', {}, __('Background Color', 'liquid-blocks')),
                        el(ColorPalette, {
                            value: backgroundColor,
                            onChange: (newVal) => setAttributes({ backgroundColor: newVal }),
                        }),
                        el('p', {}, __('Border Color', 'liquid-blocks')),
                        el(ColorPalette, {
                            value: borderColor,
                            onChange: (newVal) => setAttributes({ borderColor: newVal }),
                        }),
                    )
                ),
                el('div', { className: props.className, style: { borderColor: borderColor } },
                    el(RichText, {
                        tagName: 'p',
                        className: 'liquid-card-top',
                        placeholder: '...',
                        style: { color: textColor, backgroundColor: backgroundColor },
                        value: contentTop,
                        onChange: function( newText ) {
                            props.setAttributes({ contentTop: newText });
                        },
                    }),
                    el('div', { className: 'liquid-card-bottom' },
                        el(InnerBlocks)
                    )
                ),
            ];
        },

        save: function (props) {
            return el(
                'div', {
                    className: props.className,
                    style: { borderColor: props.attributes.borderColor },
                },
                el(RichText.Content, {
                    tagName: 'div',
                    className: 'liquid-card-top',
                    style: { color: props.attributes.textColor, backgroundColor: props.attributes.backgroundColor },
                    value: props.attributes.contentTop
                }),
                el('div', { className: 'liquid-card-bottom' },
                    el(InnerBlocks.Content)
                )
            );
        },

        transforms: {
            from: [
                {
                    type: 'block',
                    blocks: ['liquid/accordion'],
                    transform: ({ content }) => {
                        return wp.blocks.createBlock('liquid/card', {
                            content: content
                        });
                    },
                },
            ],
            to: [
                {
                    type: 'block',
                    blocks: ['liquid/accordion'],
                    transform: ({ content }) => {
                        return wp.blocks.createBlock('liquid/accordion', {
                            content: content,
                        });
                    },
                },
            ],
        },

    });

    // accordion
    blocks.registerBlockType('liquid/accordion', {
        title: __('Accordion', 'liquid-blocks'),
        icon: 'arrow-down-alt2',
        category: 'liquid',

        attributes: {
            contentTop: {
                type: 'string',
                source: 'html',
                selector: '.liquid-accordion-top'
            },
            textColor: {
                type: 'string',
                default: '#333333',
            },
            backgroundColor: {
                type: 'string',
                default: '#00aeef',
            },
            borderColor: {
                type: 'string',
                default: '#00aeef',
            },
            isOpen: {
                type: 'boolean',
                default: false,
            },
        },
        example: {
            attributes: {
                contentTop: 'Title',
            }
        },

        edit: function (props) {
            var setAttributes = props.setAttributes;
            var contentTop = props.attributes.contentTop;
            var textColor = props.attributes.textColor;
            var backgroundColor = props.attributes.backgroundColor;
            var borderColor = props.attributes.borderColor;
            var isOpen = props.attributes.isOpen;
            var showIsOpen = false;

            return [
                el(InspectorControls, null,
                    el(PanelBody, { title: __('Accordion Settings', 'liquid-blocks'), initialOpen: true },
                        showIsOpen && el(CheckboxControl, {
                            label: __('Is Open', 'liquid-blocks'),
                            checked: isOpen,
                            onChange: (newVal) => setAttributes({ isOpen: newVal })
                        }),
                        el('p', {}, __('Text Color', 'liquid-blocks')),
                        el(ColorPalette, {
                            value: textColor,
                            onChange: (newVal) => setAttributes({ textColor: newVal }),
                        }),
                        el('p', {}, __('Background Color', 'liquid-blocks')),
                        el(ColorPalette, {
                            value: backgroundColor,
                            onChange: (newVal) => setAttributes({ backgroundColor: newVal }),
                        }),
                        el('p', {}, __('Border Color', 'liquid-blocks')),
                        el(ColorPalette, {
                            value: borderColor,
                            onChange: (newVal) => setAttributes({ borderColor: newVal }),
                        }),
                    )
                ),
                el('div', { className: props.className, style: { borderColor: borderColor } },
                    el(RichText, {
                        tagName: 'p',
                        className: 'liquid-accordion-top',
                        placeholder: '...',
                        style: { color: textColor, backgroundColor: backgroundColor },
                        value: contentTop,
                        onChange: function( newText ) {
                            props.setAttributes({ contentTop: newText });
                        },
                    }),
                    el('div', { className: 'liquid-accordion-bottom' },
                        el(InnerBlocks)
                    )
                ),
            ];
        },

        save: function (props) {
            const detailsProps = {
                className: props.className,
                style: { borderColor: props.attributes.borderColor },
            };
            // isOpen
            if (props.attributes.isOpen) {
                detailsProps.open = true;
            }else{
                detailsProps.open = false;
            }
            return el(
                'details', detailsProps,
                el(RichText.Content, {
                    tagName: 'summary',
                    className: 'liquid-accordion-top',
                    style: { color: props.attributes.textColor, backgroundColor: props.attributes.backgroundColor },
                    value: props.attributes.contentTop
                }),
                el('div', { className: 'liquid-accordion-bottom' },
                    el(InnerBlocks.Content)
                )
            );
        },

        transforms: {
            from: [
                {
                    type: 'block',
                    blocks: ['liquid/card'],
                    transform: ({ content }) => {
                        return wp.blocks.createBlock('liquid/accordion', {
                            content: content
                        });
                    },
                },
            ],
            to: [
                {
                    type: 'block',
                    blocks: ['liquid/card'],
                    transform: ({ content }) => {
                        return wp.blocks.createBlock('liquid/card', {
                            content: content,
                        });
                    },
                },
            ],
        },

    });

})(
    window.wp.blocks,
    window.wp.blockEditor,
    window.wp.element,
    window.wp.components
);