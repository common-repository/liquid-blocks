( function( blocks, blockEditor, element, components ) {
    var __ = wp.i18n.__;
    var el = element.createElement;
    var InnerBlocks = blockEditor.InnerBlocks;
    var useState = wp.element.useState;
    var useEffect = wp.element.useEffect;
    var useSelect = wp.data.useSelect;
    var useDispatch = wp.data.useDispatch;
    var CheckboxControl = components.CheckboxControl;
    var InspectorControls = blockEditor.InspectorControls;
    var PanelBody = components.PanelBody;
    var TextControl = components.TextControl;
    var SelectControl = components.SelectControl;
    var Button = components.Button;

    // 子ブロック
    blocks.registerBlockType( 'liquid/slider-slide', {
        title: __('Slide', 'liquid-blocks'),
        icon: 'images-alt2',
        category: 'liquid',
        parent: ['liquid/slider'],
        supports: {
            inserter: false, // インサーターパネルからの表示を防ぐ
        },
        edit: function( props ) {
            var { clientId } = props;
            var { getBlockIndex, getBlockOrder, getBlockRootClientId } = useSelect( select => select('core/block-editor') );
            
            // ブロックのインデックスを取得
            var rootClientId = getBlockRootClientId(clientId);
            var blockIndex = getBlockIndex(clientId, rootClientId);
            var blockOrder = getBlockOrder(rootClientId);

            // コアのUPボタンをクリックする関数
            function triggerUpButton() {
                const toolbar = document.querySelector('.block-editor-block-toolbar');
                if (toolbar) {
                    const upButton = toolbar.querySelector('.is-up-button');
                    if (upButton) {
                        upButton.click();
                    } else {
                        console.log('UPボタンが見つかりませんでした');
                    }
                }
            }

            // コアのDOWNボタンをクリックする関数
            function triggerDownButton() {
                const toolbar = document.querySelector('.block-editor-block-toolbar');
                if (toolbar) {
                    const downButton = toolbar.querySelector('.is-down-button');
                    if (downButton) {
                        downButton.click();
                    } else {
                        console.log('DOWNボタンが見つかりませんでした');
                    }
                }
            }

            return el('div', {
                className: 'liquid_slider_slide',
                style: {
                    width: '100%',
                    boxSizing: 'border-box',
                    border: '1px solid #ccc',
                    marginBottom: '1rem',
                    position: 'relative'
                }
            },
            el(InnerBlocks, {
                template: [
                    ['core/cover', {}]
                ],
                templateLock: false,
                renderAppender: InnerBlocks.ButtonBlockAppender,
            }),
            el('div', {
                className: 'slide-controls',
                style: {
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    display: 'flex',
                    gap: '5px',
                    zIndex: '2'  // z-index を追加
                }
            },
                // 先頭でない場合に UP ボタンを表示
                blockIndex > 0 && el(Button, {
                    isSmall: true,
                    isPrimary: true,
                    onClick: triggerUpButton,
                }, __('Up', 'liquid-blocks')),
                
                // 最後でない場合に DOWN ボタンを表示
                blockIndex < blockOrder.length - 1 && el(Button, {
                    isSmall: true,
                    isPrimary: true,
                    onClick: triggerDownButton,
                }, __('Down', 'liquid-blocks')),
                
                el(Button, {
                    isSmall: true,
                    isDestructive: true,
                    onClick: () => wp.data.dispatch('core/block-editor').removeBlock(clientId),
                }, __('Remove', 'liquid-blocks'))
            ));
        },
        save: function() {
            return el('div', {
                className: 'liquid_slider_slide swiper-slide',
                style: {
                    width: '100%',
                    boxSizing: 'border-box',
                }
            },
            el(InnerBlocks.Content));
        },
    } );

    // 親ブロック
    blocks.registerBlockType( 'liquid/slider', {
        title: __('Carousel Slider', 'liquid-blocks'),
        icon: 'slides',
        category: 'liquid',
        attributes: {
            delay: {
                type: 'number',
                default: 3000,
            },
            slidesPerView: {
                type: 'number',
                default: 1.0,
            },
            animationType: {
                type: 'string',
                default: 'slide',
            },
            autoPlay: {
                type: 'boolean',
                default: true,
            }
        },
        supports: {
            align: ['wide', 'full']
        },
        edit: function( props ) {
            var attributes = props.attributes;
            var setAttributes = props.setAttributes;
            var magicNumber = 10;

            var [selectedSlide, setSelectedSlide] = useState(0);
            var blocks = useSelect( select => select('core/block-editor').getBlocks(props.clientId), [props.clientId]);

            function handleTabClick(index) {
                setSelectedSlide(index);
            }

            useEffect(() => {
                blocks.forEach((block, index) => {
                    const blockElement = document.querySelector(`[data-block="${block.clientId}"]`);
                    if (blockElement) {
                        if (index === selectedSlide) {
                            // 選択されたスライドを表示
                            blockElement.style.visibility = 'visible';
                            blockElement.style.height = 'auto';
                            blockElement.style.minHeight = '';
                            blockElement.style.padding = '';
                            blockElement.style.pointerEvents = '';
                        } else {
                            // 非選択のスライドを非表示
                            blockElement.style.visibility = 'hidden';
                            blockElement.style.height = '0';
                            blockElement.style.minHeight = '0';
                            blockElement.style.padding = '0';
                            blockElement.style.pointerEvents = 'none';
                        }
                    }
                });
            }, [selectedSlide, blocks]);

            return el('div', { className: 'liquid_blocks_slider' },
                el('div', { className: 'tab-wrap', style: { display: 'flex', alignItems: 'center' } },
                    blocks.map((block, index) => {
                        return el('button', {
                            key: index,
                            onClick: () => handleTabClick(index),
                            style: {
                                cursor: 'pointer',
                                padding: '5px 10px',
                                background: selectedSlide === index ? '#ddd' : '#f5f5f5',
                                marginRight: '5px',
                                border: '1px solid #ccc',
                                borderRadius: '5px 5px 0 0'
                            }
                        }, __('Slide', 'liquid-blocks') + ` ${index + 1}`);
                    }),
                    blocks.length < magicNumber && el('button', {
                        onClick: () => {
                            const newBlock = wp.blocks.createBlock('liquid/slider-slide');
                            wp.data.dispatch('core/block-editor').replaceInnerBlocks(props.clientId, [...blocks, newBlock], false);
                            handleTabClick(blocks.length);  // 新しいスライドを追加してそのスライドを選択
                        },
                        style: {
                            padding: '5px 10px',
                            background: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            cursor: 'pointer',
                            border: '1px solid #ccc',
                            borderRadius: '5px 5px 0 0'
                        }
                    }, __('Add Slide', 'liquid-blocks'))
                ),
                el('div', { className: 'slides-container', style: { width: '100%' } },
                    el(InnerBlocks, {
                        allowedBlocks: ['liquid/slider-slide'],
                        templateLock: false,
                        template: [
                            ['liquid/slider-slide', {}]  // 挿入時にデフォルトで追加
                        ],
                    })
                ),
                el(InspectorControls, {},
                    el(PanelBody, { title: __('Slider Settings', 'liquid-blocks'), initialOpen: true },
                        el('div', {},
                            el(TextControl, {
                                label: __('Delay (millisecond)', 'liquid-blocks'),
                                value: attributes.delay,
                                onChange: (newVal) => setAttributes({ delay: parseInt(newVal, 10) })
                            }),
                            el(TextControl, {
                                label: __('Number of slides per view', 'liquid-blocks'),
                                value: attributes.slidesPerView.toString(),
                                onChange: (newVal) => setAttributes({ slidesPerView: parseFloat(newVal) })
                            }),
                            el(SelectControl, {
                                label: __('Effect', 'liquid-blocks'),
                                value: attributes.animationType,
                                options: [
                                    { label: __('Slide', 'liquid-blocks'), value: 'slide' },
                                    { label: __('Fade', 'liquid-blocks'), value: 'fade' }
                                ],
                                onChange: (newVal) => setAttributes({ animationType: newVal })
                            }),
                            el(CheckboxControl, {
                                label: __('Auto Play', 'liquid-blocks'),
                                checked: attributes.autoPlay,
                                onChange: (newVal) => setAttributes({ autoPlay: newVal }),
                            })
                        )
                    )
                ),
            );
        },
        save: function( props ) {
            const { attributes } = props;
    
            return el('div', {
                className: 'liquid_blocks_slider swiper',  // .swiper クラスを親要素に追加
                'data-slides-per-view': attributes.slidesPerView,
                'data-animation-type': attributes.animationType,
                'data-delay': attributes.delay,
                'data-autoplay': attributes.autoPlay.toString(),
            },
                el('div', { className: 'slides-container swiper-wrapper' },
                    el(InnerBlocks.Content)  // 子ブロックの内容が保存される
                ),
                // Swiper用のHTML要素
                el('div', { className: 'swiper-pagination' }),
                el('div', { className: 'swiper-button-next' }),
                el('div', { className: 'swiper-button-prev' })
            );
        },
    } );
}(
    window.wp.blocks,
    window.wp.blockEditor,
    window.wp.element,
    window.wp.components
) );
