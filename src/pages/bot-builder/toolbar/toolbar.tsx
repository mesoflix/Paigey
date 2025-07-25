import React from 'react';
import { observer } from 'mobx-react-lite';
import Dialog from '@/components/shared_ui/dialog';
import { useStore } from '@/hooks/useStore';
import { Localize, localize } from '@deriv-com/translations';
import { useDevice } from '@deriv-com/ui';
import { rudderStackSendOpenEvent } from '../../../analytics/rudderstack-common-events';
import ToolbarButton from './toolbar-button';
import WorkspaceGroup from './workspace-group';

const Toolbar = observer(() => {
    const { run_panel, toolbar, quick_strategy } = useStore();
    const { isDesktop } = useDevice();
    const { is_dialog_open, closeResetDialog, onResetOkButtonClick: onOkButtonClick } = toolbar;
    const { is_running } = run_panel;
    const { setFormVisibility } = quick_strategy;
    const confirm_button_text = is_running ? localize('Yes') : localize('OK');
    const cancel_button_text = is_running ? localize('No') : localize('Cancel');
    const handleQuickStrategyOpen = () => {
        setFormVisibility(true);
        rudderStackSendOpenEvent({
            subpage_name: 'bot_builder',
            subform_source: 'bot_builder',
            subform_name: 'quick_strategy',
        });
    };
    return (
        <React.Fragment>
            <div className='toolbar dashboard__toolbar' data-testid='dt_dashboard_toolbar'>
                <div className='toolbar__section'>
                    {!isDesktop && (
                        <ToolbarButton
                            popover_message={localize('Click here to start building your paigey Bot.')}
                            button_id='db-toolbar__get-started-button'
                            button_classname='toolbar__btn toolbar__btn--icon toolbar__btn--start'
                            buttonOnClick={handleQuickStrategyOpen}
                            button_text={localize('Quick strategy')}
                        />
                    )}
                    {isDesktop && <WorkspaceGroup />}
                </div>
            </div>
            {!isDesktop && <WorkspaceGroup />}
            <Dialog
                portal_element_id='modal_root'
                title={localize('Are you sure?')}
                is_visible={is_dialog_open}
                confirm_button_text={confirm_button_text}
                onConfirm={onOkButtonClick}
                cancel_button_text={cancel_button_text}
                onCancel={closeResetDialog}
                is_mobile_full_width={false}
                className={'toolbar__dialog'}
                has_close_icon
            >
                {is_running ? (
                    <Localize
                        i18n_default_text='The workspace will be reset to the default strategy and any unsaved changes will be lost. <0>Note: This will not affect your running bot.</0>'
                        components={[
                            <div
                                key={0}
                                className='toolbar__dialog-text--second'
                                data-testid='dt_toolbar_dialog_text_second'
                            />,
                        ]}
                    />
                ) : (
                    <Localize i18n_default_text='Any unsaved changes will be lost.' />
                )}
            </Dialog>
        </React.Fragment>
    );
});

export default Toolbar;
