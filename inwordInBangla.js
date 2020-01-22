/*!
 * InwordBangla v1.0.0 ()
 * Release: 21th Jan, 2020
 * Author : Manoz Debnath
 *  */

(function ($) {

    $.fn.inwordBangla = function (options = null) {

        var options = $.extend({
            // These are the defaults.
            type: "helper",                         //default#helper, tooltip, placer
            value: null,                            //if value is given, it will be override origina value
            position: "right",                      //applicable for 'tooltip/helper' only; values : right, left, top, bottom; default: right
            color: "#ffffff",
            backgroundColor: "#47a3da",
            prefix: null,
            suffix: null,
            placerId: null,                         //DOM id where you want to show the placer, applicable for placer only
            hover: false,                           //applicable for non-element input only
            case: 'ucfirst',                        //ucfirst, upper, lower
            wordJoiner: '-',                        //twenty-five, forty-five, if revoked twenty five, forty five
            thousandSeperator: '',                  //nine thousand four hundred sixty, if ',' given, nine thousand, four hundred sixty
            ignoreDecimal: false,                   //decimal value will not be shown
        }, options);

        /************************** Data Validation  :: START **************************************/

        if ($.inArray(options.type, ['helper', 'tooltip', 'placer']) === -1) {
            throw new TypeError('Invalid type ' + options.type)
        }
        ;
        if (options.value !== null && typeof options.value !== 'number') throw new TypeError('Value must be number, ' + options.value + ' given');
        if ($.inArray(options.position, ['right', 'left', 'top', 'bottom']) === -1) {
            throw new TypeError('Invalid position ' + options.position)
        }
        ;
        if (!options.color.match(/^#[0-9a-f]{3,6}$/i)) {
            throw new TypeError('Invalid color hex code ' + options.color)
        }
        ;
        if (!options.backgroundColor.match(/^#[0-9a-f]{3,6}$/i)) {
            throw new TypeError('Invalid backgroundColor hex code ' + options.backgroundColor)
        }
        ;
        if (options.prefix !== null && typeof options.prefix !== 'string') throw new TypeError('Prefix must be string, ' + typeof options.prefix + ' given');
        if (options.suffix !== null && typeof options.suffix !== 'string') throw new TypeError('Suffix must be string, ' + typeof options.suffix + ' given');
        if (options.placerId !== null && options.type !== 'placer') throw new TypeError('placerId only works with type:placer, ' + options.type + ' given');
        if (options.placerId !== null && typeof options.placerId !== 'string') throw new TypeError('placerId must be string, ' + typeof options.suffix + ' given');
        if ($.inArray(options.case, ['ucfirst', 'upper', 'lower']) === -1) {
            throw new TypeError('Invalid case ' + options.case)
        }
        ;
        if (options.wordJoiner !== null && typeof options.wordJoiner !== 'string') throw new TypeError('wordJoiner must be string, ' + typeof options.wordJoiner + ' given');
        if (options.thousandSeperator !== null && typeof options.thousandSeperator !== 'string') throw new TypeError('thousandSeperator must be string, ' + typeof options.thousandSeperator + ' given');

        /************************** Data Validation  :: END **************************************/

        /****************** Converts Number to Word  :: START **************************************/

        var isFinite = function (value) {
            return !(typeof value !== 'number' || value !== value || value === Infinity || value === -Infinity);
        }

        var TEN = 10;
        var ONE_HUNDRED = 100;
        var ONE_THOUSAND = 1000;
        var ONE_LAC = 100000;
        var ONE_MILLION = 1000000;
        var ONE_CRORE = 10000000;
        var ONE_BILLION = 1000000000;               //          1.000.000.000 (9)
        var ONE_TRILLION = 1000000000000;           //     1.000.000.000.000 (12)
        var ONE_QUADRILLION = 1000000000000000;     // 1.000.000.000.000.000 (15)
        var MAX = 9007199254740992;                 // 9.007.199.254.740.992 (15)

        /**
         * Converts an integer into words.
         * If number is decimal, the decimals will be removed.
         * @example toWords(12) : 'twelve'
         * @param {number|string} number
         * @returns {string}
         */
        var toWords = function (number) {

            //before decimal part
            var words;
            var num = parseInt(number, 10);
            if (!isFinite(num)) throw new TypeError('Not a finite number: ' + number + ' (' + typeof number + ')');
            words = numberToWord(num);
            var target = (options.prefix != null ? options.prefix : '') + ' ' + words +
                ' ' + (options.suffix != null ? options.suffix : '');

            //after decimal part
            if (!options.ignoreDecimal) {
                var numArr = number.split(".");
                if (typeof numArr[1] != 'undefined') {
                    var decimals = numArr[1];
                    var str = ' দশমিক ';
                    var i;
                    for (i = 0; i < decimals.length; i++) {
                        str += (num_to_bn_decimal[decimals[i]] + ' ');
                    }
                    target += str;
                }
            }

            return target;
        }

        var toTitleCase = function (str) {
            return str.replace(
                /\w\S*/g,
                function (txt) {
                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                }
            );
        }


        var eng_to_bn = {
            '1': '১',
            '2': '২',
            '3': '৩',
            '4': '৪',
            '5': '৫',
            '6': '৬',
            '7': '৭',
            '8': '৮',
            '9': '৯',
            '0': '০'
        };
        var num_to_bd = {
            '0': 'শূন্য',
            '1': 'এক',
            '2': 'দুই',
            '3': 'তিন',
            '4': 'চার',
            '5': 'পাঁচ',
            '6': 'ছয়',
            '7': 'সাত',
            '8': 'আট',
            '9': 'নয়',
            '10': 'দশ',
            '11': 'এগার',
            '12': 'বার',
            '13': 'তের',
            '14': 'চৌদ্দ',
            '15': 'পনের',
            '16': 'ষোল',
            '17': 'সতের',
            '18': 'আঠার',
            '19': 'ঊনিশ',
            '20': 'বিশ',
            '21': 'একুশ',
            '22': 'বাইশ',
            '23': 'তেইশ',
            '24': 'চব্বিশ',
            '25': 'পঁচিশ',
            '26': 'ছাব্বিশ',
            '27': 'সাতাশ',
            '28': 'আঠাশ',
            '29': 'ঊনত্রিশ',
            '30': 'ত্রিশ',
            '31': 'একত্রিশ',
            '32': 'বত্রিশ',
            '33': 'তেত্রিশ',
            '34': 'চৌত্রিশ',
            '35': 'পঁয়ত্রিশ',
            '36': 'ছত্রিশ',
            '37': 'সাঁইত্রিশ',
            '38': 'আটত্রিশ',
            '39': 'ঊনচল্লিশ',
            '40': 'চল্লিশ',
            '41': 'একচল্লিশ',
            '42': 'বিয়াল্লিশ',
            '43': 'তেতাল্লিশ',
            '44': 'চুয়াল্লিশ',
            '45': 'পঁয়তাল্লিশ',
            '46': 'ছেচল্লিশ',
            '47': 'সাতচল্লিশ',
            '48': 'আটচল্লিশ',
            '49': 'ঊনপঞ্চাশ',
            '50': 'পঞ্চাশ',
            '51': 'একান্ন',
            '52': 'বায়ান্ন',
            '53': 'তিপ্পান্ন',
            '54': 'চুয়ান্ন',
            '55': 'পঞ্চান্ন',
            '56': 'ছাপ্পান্ন',
            '57': 'সাতান্ন',
            '58': 'আটান্ন',
            '59': 'ঊনষাট',
            '60': 'ষাট',
            '61': 'একষট্টি',
            '62': 'বাষট্টি',
            '63': 'তেষট্টি',
            '64': 'চৌষট্টি',
            '65': 'পঁয়ষট্টি',
            '66': 'ছেষট্টি',
            '67': 'সাতষট্টি',
            '68': 'আটষট্টি',
            '69': 'ঊনসত্তর',
            '70': 'সত্তর',
            '71': 'একাত্তর',
            '72': 'বাহাত্তর',
            '73': 'তিয়াত্তর',
            '74': 'চুয়াত্তর',
            '75': 'পঁচাত্তর',
            '76': 'ছিয়াত্তর',
            '77': 'সাতাত্তর',
            '78': 'আটাত্তর',
            '79': 'ঊনআশি',
            '80': 'আশি',
            '81': 'একাশি',
            '82': 'বিরাশি',
            '83': 'তিরাশি',
            '84': 'চুরাশি',
            '85': 'পঁচাশি',
            '86': 'ছিয়াশি',
            '87': 'সাতাশি',
            '88': 'আটাশি',
            '89': 'ঊননব্বই',
            '90': 'নব্বই',
            '91': 'একানব্বই',
            '92': 'বিরানব্বই',
            '93': 'তিরানব্বই',
            '94': 'চুরানব্বই',
            '95': 'পঁচানব্বই',
            '96': 'ছিয়ানব্বই',
            '97': 'সাতানব্বই',
            '98': 'আটানব্বই',
            '99': 'নিরানব্বই'
        };
        var num_to_bn_decimal = {
            '0': 'শূন্য ',
            '1': 'এক ',
            '2': 'দুই ',
            '3': 'তিন ',
            '4': 'চার ',
            '5': 'পাঁচ ',
            '6': 'ছয় ',
            '7': 'সাত ',
            '8': 'আট ',
            '9': 'নয় '
        };
        var hundred = 'শত';
        var thousand = 'হাজার';
        var lakh = 'লক্ষ';
        var crore = 'কোটি';


        var engToBnfunc = function (number) {
            bn_number = num_to_bd[number];
            return bn_number;
        };

        var numberToWord = function (number) {
            var minus= '';
            if (isNaN(number)) return 'Not a Number';
            if (number < 0) {
                minus = 'ঋণাত্মক ';
                number = Math.abs(number);
            }
            if (!isFloat(number)) {
                var dot = number.toString().split(".");
                var decimalPart = '';
                if (dot[1])
                    decimalPart = ' দশমিক ' + numToBnDecimalfunc(dot[1]);
                return minus + numberSelector(dot[0]) + decimalPart;
            } else {
                return minus +  numberSelector(number);
            }
        };

        var isFloat = function (n) {
            return Number(n) === n && n % 1 !== 0;
        };
        var numToBnfunc = function (number) {
            var word = num_to_bd[number];
            return word;
        };

        var numToBnDecimalfunc = function (number) {
            var word = '';
            word += strtr(number, num_to_bn_decimal);
            return word;
        };

        var strtr = function (number, arr) {
            var str = '';
            for (let i = 0; i < number.length; i++) {
                var ch = number.charAt(i);
                str += arr[ch];
            }
            return str;
        };


        var numberSelector = function (number) {
            if (number > 9999999) {
                return crorefunc(number);
            } else if (number > 99999) {
                return lakhfunc(number);
            } else if (number > 999) {
                return thousandfunc(number);
            } else if (number > 99) {
                return hundredfunc(number);
            } else {
                return underHundredfunc(number);
            }
        };

        var underHundredfunc = function (number) {
            number = (number === 0) ? '' : numToBnfunc(number);
            return number;
        };

        var hundredfunc = function (number) {
            var a = parseInt((number / 100), 10);
            var b = parseInt((number % 100), 10);
            var hundredvar = (a === 0) ? '' : numToBnfunc(a) + ' ' + hundred;
            return hundredvar + ' ' + underHundredfunc(b);
        };
        var thousandfunc = function (number) {
            var a = parseInt((number / 1000), 10);
            var b = parseInt((number % 1000), 10);
            var thousandvar = (a === 0) ? '' : numToBnfunc(a) + ' ' + thousand;
            return thousandvar + ' ' + hundredfunc(b);
        };

        var lakhfunc = function (number) {
            var a = parseInt((number / 100000), 10);
            var b = parseInt((number % 100000), 10);
            var lakhVar = (a === 0) ? '' : numToBnfunc(a) + ' ' + lakh;
            return lakhVar + ' ' + thousandfunc(b);
        };

        var crorefunc = function (number) {
            var a = parseInt((number / 10000000), 10);
            var b = parseInt((number % 10000000), 10);
            var more_than_core = (a > 99) ? lakhfunc(a) : numToBnfunc(a);
            return more_than_core + ' ' + crore + ' ' + lakhfunc(b);
        };

        var generateWordsInBangla = function (number) {

        };


        var generateWords = function (number) {
            var remainder, word,
                words = arguments[1];

            // We’re done
            if (number === 0) {
                return !words ? 'zero' : words.join(' ').replace(/,$/, '');
            }
            // First run
            if (!words) {
                words = [];
            }
            // If negative, prepend “minus”
            if (number < 0) {
                words.push('minus');
                number = Math.abs(number);
            }

            if (number < 20) {
                remainder = 0;
                word = LESS_THAN_TWENTY[number];

            } else if (number < ONE_HUNDRED) {
                remainder = number % TEN;
                word = TENTHS_LESS_THAN_HUNDRED[Math.floor(number / TEN)];
                // In case of remainder, we need to handle it here to be able to add the “-”
                if (remainder) {
                    word += options.wordJoiner + LESS_THAN_TWENTY[remainder];
                    remainder = 0;
                }

            } else if (number < ONE_THOUSAND) {
                remainder = number % ONE_HUNDRED;
                word = generateWords(Math.floor(number / ONE_HUNDRED)) + ' hundred';

            } else if (number < ONE_LAC) {
                remainder = number % ONE_THOUSAND;
                word = generateWords(Math.floor(number / ONE_THOUSAND)) + ' thousand' + options.thousandSeperator;

            }
            else if (number < ONE_MILLION && number >= ONE_LAC) {
                remainder = number % ONE_LAC;
                word = generateWords(Math.floor(number / ONE_LAC)) + ' lac' + options.thousandSeperator;

            } else if (number < ONE_CRORE && number >= ONE_MILLION) {
                remainder = number % ONE_LAC;
                word = generateWords(Math.floor(number / ONE_LAC)) + ' lac' + options.thousandSeperator;

            } else if (number < ONE_BILLION && number >= ONE_CRORE) {
                remainder = number % ONE_CRORE;
                word = generateWords(Math.floor(number / ONE_CRORE)) + ' crore' + options.thousandSeperator;

            }
            else if (number < ONE_TRILLION) {
                remainder = number % ONE_BILLION;
                word = generateWords(Math.floor(number / ONE_BILLION)) + ' billion' + options.thousandSeperator;

                /* }else if (number < ONE_QUADRILLION && number >= ONE_TRILLION) {
                 remainder = number % ONE_BILLION;
                 word = generateWords(Math.floor(number / ONE_BILLION)) + ' billion' + options.thousandSeperator;*/

            } else if (number < ONE_QUADRILLION) {
                remainder = number % ONE_TRILLION;
                word = generateWords(Math.floor(number / ONE_TRILLION)) + ' trillion' + options.thousandSeperator;

            } else if (number <= MAX) {
                remainder = number % ONE_QUADRILLION;
                word = generateWords(Math.floor(number / ONE_QUADRILLION)) +
                    ' quadrillion' + options.thousandSeperator;
            }

            words.push(word);
            return generateWords(remainder, words);
        }

        /****************** Converts Number to Word  :: END **************************************/

        var helperDiv = 'helper' + options.position.replace(/^./, options.position[0].toUpperCase());

        var setValue = function (e) {
            var value;

            if (options.value !== null) {
                value = options.value.toString();
            } else if ($(e).is('input')) {
                value = filterValue(e.value);
            } else {
                value = filterValue($(e).html());
            }
            return value
        }

        var showInWords = function (e) {

            var identifier = $(e).attr('data-in-word');
            var holder = (options.placerId == null) ? 'inWord-' + identifier : options.placerId;
            var value = setValue(e);

            if (value != '') {
                var amountInWord = toWords(value);

                if (options.case === 'ucfirst') {
                    amountInWord = toTitleCase(amountInWord);
                } else if (options.case === 'upper') {
                    amountInWord = amountInWord.toUpperCase();
                } else if (options.case === 'lower') {
                    amountInWord = amountInWord.toLowerCase();
                }

                switch (options.type) {
                    case 'placer':
                        $('#' + holder).html(amountInWord).show();
                        break;
                    case 'tooltip':
                        $('[data-in-word=' + identifier + ']').attr('data-original-title', amountInWord).tooltip('show');
                        break;
                    default:
                        // console.log(options.color);
                        $('.helper').css({'background-color': options.backgroundColor, 'color': options.color});
                        //$('.helper').css({'font-size': Math.random()});
                        $('#' + helperDiv).html(amountInWord);
                        $('#' + helperDiv).addClass('helper-open');
                }
            } else {
                switch (options.type) {
                    case 'placer':
                        $('#' + holder).html('');
                        break;
                    case 'tooltip':
                        $('[data-in-word=' + identifier + ']').attr('data-original-title', '').tooltip('hide');
                        break;
                    default:
                        $('#' + helperDiv + ' span').html('');
                        $('#' + helperDiv).removeClass('helper-open');
                }
            }
        }

        var filterValue = function (val) {
            return val.replace(',', '');
        }

        var uuid = function () {
            return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
                (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
            );
        }

        var clearInWords = function (obj = null) {
            if (options.type == 'placer') {
                var identifier = $(obj).attr('data-in-word');
                if (options.placerId == null) {
                    $('#inWord-' + identifier).html('').hide();
                }
            } else if (options.type == 'helper') {
                $('#helperRight').removeClass('helper-open');
                $('#helperLeft').removeClass('helper-open');
                $('#helperTop').removeClass('helper-open');
                $('#helperBottom').removeClass('helper-open');
            }
        }

        //Prepare
        $(this).each(function (i) {

            switch (options.type) {

                case 'placer':

                    var uniqueId = uuid();
                    $(this).attr('data-in-word', uniqueId);
                    //$(this).addClass('data-in-word-' + uniqueId);
                    if (options.placerId == null) {
                        if ($(this).is('input')) {
                            $(this).after('<span class="help-block" id="inWord-' + uniqueId + '"></span>');
                        } else {
                            $(this).append('<span class="help-block" id="inWord-' + uniqueId + '"></span>');
                        }
                    }

                    break;

                case 'tooltip':

                    var uniqueId = uuid();
                    $(this).attr('data-in-word', uniqueId);
                    var value = setValue(this);
                    if (value != '') {
                        var amountInWord = toWords(value);
                        $(this).attr('data-original-title', amountInWord);
                    }
                    $(this).attr('data-placement', options.position);
                    var backGroundCss = arrowCss = '';

                    if (options.backgroundColor != '#47a3da') {
                        backGroundCss += 'background-color: ' + options.backgroundColor + '; ';
                        arrowCss = '[data-in-word="' + uniqueId + '"] + .tooltip > .tooltip-arrow {border-' + options.position + '-color: ' + options.backgroundColor + '}';
                    }

                    if (options.color != '#ffffff') {
                        backGroundCss += 'color: ' + options.color + ';';
                    }

                    if (backGroundCss !== '') {
                        $('body').append('<style type="text/css" data-ref="' + uniqueId + '">[data-in-word="' + uniqueId + '"] + .tooltip > .tooltip-inner {' + backGroundCss + '} ' + arrowCss + '</style>');
                    }

                    $(this).tooltip();

                    break;

                default:

                    var helperAlignment = {
                        'right': 'vertical',
                        'left': 'vertical',
                        'top': 'horizontal',
                        'bottom': 'horizontal'
                    };

                    if ($('#' + helperDiv).length == 0) {
                        $('body').append('<nav class="helper helper-' + helperAlignment[options.position] + ' helper-' + options.position + '" id="' + helperDiv + '"></nav>');
                    }
            }

        });

        if ($(this).is('input')) {

            //On Focus
            $(this).focus(function () {
                showInWords(this);
            });

        } else {
            if (options.hover) {

                if (options.type == 'helper' || options.type == 'placer') {
                    //On Mouse Enter
                    $(this).mouseenter(function () {
                        showInWords(this);
                    });
                }

            } else {
                //On Click
                $(this).click(function () {
                    showInWords(this);
                });
            }

            //On Mouse Leave
            $(this).mouseleave(function () {
                clearInWords(this);
            });
        }

        //On Blur
        $(this).blur(function () {
            clearInWords(this);
        });

        //Change
        $(this).bind("change keyup input", function () {
            showInWords(this);
        });

    };

}(jQuery));