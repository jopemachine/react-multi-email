var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import isEmailFn from './isEmail';
import Spinner from './Spinner';
class ReactMultiEmail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            focused: false,
            emails: [],
            inputValue: '',
            spinning: false,
        };
        this.findEmailAddress = (value, isEnter) => __awaiter(this, void 0, void 0, function* () {
            let asyncFlag = false;
            const { validateEmail, enableSpinner } = this.props;
            let validEmails = [];
            let inputValue = '';
            const re = /[ ,;]/g;
            const isEmail = validateEmail || isEmailFn;
            const addEmails = (email) => {
                const emails = this.state.emails;
                for (let i = 0, l = emails.length; i < l; i++) {
                    if (emails[i] === email) {
                        return false;
                    }
                }
                validEmails.push(email);
                return true;
            };
            if (value !== '') {
                if (re.test(value)) {
                    let splitData = value.split(re).filter(n => {
                        return n !== '' && n !== undefined && n !== null;
                    });
                    const setArr = new Set(splitData);
                    let arr = [...setArr];
                    do {
                        const validateResult = isEmail('' + arr[0]);
                        if (typeof validateResult === 'boolean') {
                            if (validateResult === true) {
                                addEmails('' + arr.shift());
                            }
                            else {
                                if (arr.length === 1) {
                                    inputValue = '' + arr.shift();
                                }
                                else {
                                    arr.shift();
                                }
                            }
                        }
                        else {
                            // handle promise
                            asyncFlag = true;
                            if (!enableSpinner || enableSpinner == true) {
                                this.setState({ spinning: true });
                            }
                            if ((yield validateEmail(value)) === true) {
                                addEmails('' + arr.shift());
                                this.setState({ spinning: false });
                            }
                            else {
                                if (arr.length === 1) {
                                    inputValue = '' + arr.shift();
                                }
                                else {
                                    arr.shift();
                                }
                            }
                        }
                    } while (arr.length);
                }
                else {
                    if (isEnter) {
                        const validateResult = isEmail(value);
                        if (typeof validateResult === 'boolean') {
                            if (validateResult === true) {
                                addEmails(value);
                            }
                            else {
                                inputValue = value;
                            }
                        }
                        else {
                            // handle promise
                            asyncFlag = true;
                            if (!enableSpinner || enableSpinner == true) {
                                this.setState({ spinning: true });
                            }
                            if ((yield validateEmail(value)) === true) {
                                addEmails(value);
                                this.setState({ spinning: false });
                            }
                            else {
                                inputValue = value;
                            }
                        }
                    }
                    else {
                        inputValue = value;
                    }
                }
            }
            this.setState({
                emails: [...this.state.emails, ...validEmails],
                inputValue: inputValue,
            });
            if (validEmails.length && this.props.onChange) {
                // In async, input email is merged.
                if (asyncFlag)
                    this.props.onChange([...this.state.emails]);
                else {
                    this.props.onChange([...this.state.emails, ...validEmails]);
                }
            }
        });
        this.onChangeInputValue = (value) => __awaiter(this, void 0, void 0, function* () {
            yield this.findEmailAddress(value);
        });
        this.removeEmail = (index) => {
            this.setState((prevState) => {
                return {
                    emails: [
                        ...prevState.emails.slice(0, index),
                        ...prevState.emails.slice(index + 1),
                    ],
                };
            }, () => {
                if (this.props.onChange) {
                    this.props.onChange(this.state.emails);
                }
            });
        };
        this.handleOnKeydown = (e) => {
            switch (e.which) {
                case 13:
                case 9:
                    e.preventDefault();
                    break;
                case 8:
                    if (!e.currentTarget.value) {
                        this.removeEmail(this.state.emails.length - 1);
                    }
                    break;
                default:
            }
        };
        this.handleOnKeyup = (e) => {
            switch (e.which) {
                case 13:
                case 9:
                    this.findEmailAddress(e.currentTarget.value, true);
                    break;
                default:
            }
        };
        this.handleOnChange = (e) => __awaiter(this, void 0, void 0, function* () { return yield this.onChangeInputValue(e.currentTarget.value); });
        this.handleOnBlur = (e) => {
            this.setState({ focused: false });
            this.findEmailAddress(e.currentTarget.value, true);
        };
        this.handleOnFocus = () => this.setState({
            focused: true,
        });
        props.autoFocus && (this.state.focused = props.autoFocus);
        this.emailInputRef = React.createRef();
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState.propsEmails !== nextProps.emails) {
            return {
                propsEmails: nextProps.emails || [],
                emails: nextProps.emails || [],
                inputValue: '',
                focused: false,
            };
        }
        return null;
    }
    render() {
        const { focused, emails, inputValue, spinning } = this.state;
        const { style, getLabel, className = '', noClass, placeholder, } = this.props;
        return (React.createElement("div", { className: `${className} ${noClass ? '' : 'react-multi-email'} ${focused ? 'focused' : ''} ${inputValue === '' && emails.length === 0 ? 'empty' : ''}`, style: style, onClick: () => {
                if (this.emailInputRef.current) {
                    this.emailInputRef.current.focus();
                }
            } },
            spinning && React.createElement(Spinner, null),
            placeholder ? React.createElement("span", { "data-placeholder": true }, placeholder) : null,
            React.createElement("div", { className: 'data-labels', style: { opacity: spinning ? 0.45 : 1.0, display: 'inherit' } }, emails.map((email, index) => getLabel(email, index, this.removeEmail))),
            React.createElement("input", { style: { opacity: spinning ? 0.45 : 1.0 }, ref: this.emailInputRef, type: "text", value: inputValue, onFocus: this.handleOnFocus, onBlur: this.handleOnBlur, onChange: this.handleOnChange, onKeyDown: this.handleOnKeydown, onKeyUp: this.handleOnKeyup, autoFocus: this.props.autoFocus })));
    }
}
export default ReactMultiEmail;
