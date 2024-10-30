( function( blocks, blockEditor, element, components ) {
    var __ = wp.i18n.__;
    var registerBlockType = blocks.registerBlockType;
    var InspectorControls = blockEditor.InspectorControls;
    var BlockControls = blockEditor.BlockControls;
    var AlignmentToolbar = blockEditor.AlignmentToolbar;
    var RichText = blockEditor.RichText;
    var useBlockProps = blockEditor.useBlockProps;
    var PanelBody = components.PanelBody;
    var TextControl = components.TextControl;
    var SelectControl = components.SelectControl;
    var createElement = element.createElement;

    registerBlockType('liquid/custom-field', {
        title: __('Custom Field', 'liquid-blocks'),
        icon: 'admin-tools',
        category: 'liquid',
        attributes: {
            fieldKey: {
                type: 'string',
                default: ''
            },
            postId: {
                type: 'string',
                default: ''
            },
            // content: {
            //     type: 'string',
            //     source: 'html',
            //     selector: 'p'
            // },
            fieldType: {
                type: 'string',
                default: 'text'
            },
            alignment: {
                type: 'string',
                default: 'left'
            }
        },
        edit: function( props ) {
            var fieldKey = props.attributes.fieldKey;
            var postId = props.attributes.postId;
            var fieldType = props.attributes.fieldType;
            var alignment = props.attributes.alignment;

            var blockProps = useBlockProps({
                className: 'liquid_custom_field',
                style: {
                    textAlign: alignment
                }
            });

            return createElement(
                'div',
                blockProps,
                createElement(
                    InspectorControls,
                    null,
                    // Custom Field Settings Panel
                    createElement(
                        PanelBody,
                        { title: __('Custom Field Settings', 'liquid-blocks') },
                        createElement(
                            TextControl,
                            {
                                label: __('Custom Field Key', 'liquid-blocks'),
                                value: fieldKey,
                                onChange: function(value) {
                                    props.setAttributes({ fieldKey: value });
                                },
                                help: __('Enter custom field key to display data on public screens.', 'liquid-blocks')
                            }
                        ),
                        createElement(
                            TextControl,
                            {
                                label: __('Post ID', 'liquid-blocks'),
                                value: postId,
                                onChange: function(value) {
                                    props.setAttributes({ postId: value });
                                },
                                help: __('Enter a Post ID to retrieve custom field data from a specific post. Leave empty to use current post.', 'liquid-blocks')
                            }
                        ),
                        createElement(
                            SelectControl,
                            {
                                label: __('Field Type', 'liquid-blocks'),
                                value: fieldType,
                                options: [
                                    { label: __('Text', 'liquid-blocks'), value: 'text' },
                                    { label: __('Image', 'liquid-blocks'), value: 'image' }
                                ],
                                onChange: function(value) {
                                    props.setAttributes({ fieldType: value });
                                },
                                help: __('Select whether the custom field is a text or an image field.', 'liquid-blocks')
                            }
                        )
                    )
                ),
                createElement(
                    BlockControls,
                    null,
                    createElement(AlignmentToolbar, {
                        value: alignment,
                        onChange: function(newAlignment) {
                            props.setAttributes({ alignment: newAlignment || 'left' });
                        }
                    })
                ),
                createElement(
                    RichText,
                    {
                        tagName: 'p',
                        value: __('Custom Field Key: ', 'liquid-blocks') + '<strong>' + (fieldKey || __('Null', 'liquid-blocks')) + '</strong> ' + __('Post ID: ', 'liquid-blocks') + '<strong>' + (postId || __('Current Post', 'liquid-blocks')) + '</strong>',
                        style: {
                            textAlign: alignment
                        }
                    }
                )
            );
        },
        save: function( props ) {
            var blockProps = useBlockProps.save({
                style: {
                    textAlign: props.attributes.alignment
                }
            });
            return createElement(
                'div',
                blockProps
            );
        }
    });
}(
    window.wp.blocks,
    window.wp.blockEditor,
    window.wp.element,
    window.wp.components
) );
