// Copyright 2017 Jamie Hale
//
// This file is part of Tablescript.js.
//
// Tablescript.js is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Tablescript.js is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Tablescript.js. If not, see <http://www.gnu.org/licenses/>.

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const expect = chai.expect;

import { valueTypes, valueTypeName } from '../../values/types';
import { createBinaryExpression } from '../binary';
import { isBooleanValue, isNumericValue, isStringValue } from '../../__test__/util';
import { createStringValue } from '../../values/string';
import { createNumericValue } from '../../values/numeric';
import { createBooleanValue } from '../../values/boolean';

describe('createBinaryExpression', () => {

  describe('evaluate', () => {
    describe('or', () => {
      describe('when left expression evaluates to true', () => {
        let result;

        beforeEach(() => {
          const mockLeftExpression = {
            evaluate: () => ({
              asNativeBoolean: () => true
            })
          };
          const expression = createBinaryExpression({}, mockLeftExpression, 'or', undefined);
          result = expression.evaluate({});
        })

        it('returns boolean true', () => {
          return expect(result).to.eventually.satisfy(isBooleanValue(true));
        });
      });

      describe('when left expression evaluates to false', () => {
        let result;

        beforeEach(() => {
          const mockLeftExpression = {
            evaluate: () => ({
              asNativeBoolean: () => false
            })
          };
          const mockRightExpression = {
            evaluate: () => ({
              asNativeBoolean: () => false
            })
          };
          const expression = createBinaryExpression({}, mockLeftExpression, 'or', mockRightExpression);
          result = expression.evaluate({});
        });

        it('returns boolean false', () => {
          return expect(result).to.eventually.satisfy(isBooleanValue(false));
        });
      });
    });

    describe('and', () => {
      describe('when left expression evaluates to false', () => {
        let result;

        beforeEach(() => {
          const mockLeftExpression = {
            evaluate: () => ({
              asNativeBoolean: () => false
            })
          };
          const expression = createBinaryExpression({}, mockLeftExpression, 'and', undefined);
          result = expression.evaluate({});
        })

        it('returns boolean false', () => {
          return expect(result).to.eventually.satisfy(isBooleanValue(false));
        });
      });

      describe('when left expression evaluates to true', () => {
        let result;

        beforeEach(() => {
          const mockLeftExpression = {
            evaluate: () => ({
              asNativeBoolean: () => true
            })
          };
          const mockRightExpression = {
            evaluate: () => ({
              asNativeBoolean: () => true
            })
          };
          const expression = createBinaryExpression({}, mockLeftExpression, 'or', mockRightExpression);
          result = expression.evaluate({});
        });

        it('returns the right expression value', () => {
          return expect(result).to.eventually.satisfy(isBooleanValue(true));
        });
      });
    });

    describe('+', () => {
      describe('when left side is a string', () => {
        let mockLeftExpression;

        beforeEach(() => {
          mockLeftExpression = {
            evaluate: () => ({
              type: valueTypes.STRING,
              asNativeString: () => 'left value'
            })
          };
        });

        describe('when right side can be converted to a string', () => {
          let result;

          beforeEach(() => {
            const mockRightExpression = {
              evaluate: () => ({
                asNativeString: () => 'right value'
              })
            };
            const expression = createBinaryExpression({}, mockLeftExpression, '+', mockRightExpression);
            result = expression.evaluate();
          });

          it('returns the left and right values concatenated', () => {
            return expect(result).to.eventually.satisfy(isStringValue('left valueright value'));
          });
        });

        it('throws when the right side cannot be converted to a string', () => {
          const mockRightExpression = {
            evaluate: () => ({
              asNativeString: () => { throw new Error('Something went wrong'); }
            })
          };
          const expression = createBinaryExpression({}, mockLeftExpression, '+', mockRightExpression);
          return expect(expression.evaluate()).to.eventually.be.rejectedWith('Something went wrong');
        });
      });

      describe('when left side is a number', () => {
        let mockLeftExpression;

        beforeEach(() => {
          mockLeftExpression = {
            evaluate: () => ({
              type: valueTypes.NUMBER,
              asNativeNumber: () => 12
            })
          };
        });

        describe('when right side can be converted to a number', () => {
          let result;

          beforeEach(() => {
            const mockRightExpression = {
              evaluate: () => ({
                type: valueTypes.NUMBER,
                asNativeNumber: () => 9
              })
            };
            const expression = createBinaryExpression({}, mockLeftExpression, '+', mockRightExpression);
            result = expression.evaluate({});
          });

          it('returns the sum of the two numbers', () => {
            return expect(result).to.eventually.satisfy(isNumericValue(21));
          });
        });

        it('throws when right side cannot be converted to a number', () => {
          const mockRightExpression = {
            evaluate: () => ({
              asNativeNumber: () => { throw new Error('Something went wrong'); }
            })
          };
          const expression = createBinaryExpression({}, mockLeftExpression, '+', mockRightExpression);
          return expect(expression.evaluate()).to.eventually.be.rejectedWith('Something went wrong');
        });
      });

      it('throws when left side is not a string or a number', () => {
        const mockLeftExpression = {
          evaluate: () => ({
            type: valueTypes.UNDEFINED
          })
        };
        const mockRightExpression = {
          evaluate: () => undefined
        };
        const expression = createBinaryExpression({}, mockLeftExpression, '+', mockRightExpression);
        return expect(expression.evaluate()).to.eventually.be.rejectedWith('Cannot add these values');
      });
    });

    describe('-', () => {
      it('throws if the left value cannot be converted to a number', () => {
        const mockLeftExpression = {
          evaluate: () => createStringValue('Not subtractable'),
        };
        const mockRightExpression = {
          evaluate: () => undefined
        };
        const expression = createBinaryExpression({}, mockLeftExpression, '-', mockRightExpression);
        return expect(expression.evaluate()).to.eventually.be.rejectedWith('Cannot subtract these values');
      });

      it('throws if the right value cannot be converted to a number', () => {
        const mockLeftExpression = {
          evaluate: () => createNumericValue(9),
        };
        const mockRightExpression = {
          evaluate: () => createStringValue('Not subtractable'),
        };
        const expression = createBinaryExpression({}, mockLeftExpression, '-', mockRightExpression);
        return expect(expression.evaluate()).to.eventually.be.rejectedWith('Cannot subtract these values');
      });

      describe('when both values are numeric', () => {
        let result;

        beforeEach(() => {
          const mockLeftExpression = {
            evaluate: () => createNumericValue(9),
          };
          const mockRightExpression = {
            evaluate: () => createNumericValue(3),
          };
          const expression = createBinaryExpression({}, mockLeftExpression, '-', mockRightExpression);
          result = expression.evaluate();
        });

        it('returns the difference between the two numbers', () => {
          return expect(result).to.eventually.satisfy(isNumericValue(6));
        });
      });
    });

    describe('*', () => {
      it('throws if the left value cannot be converted to a number', () => {
        const mockLeftExpression = {
          evaluate: () => createBooleanValue(true),
        };
        const mockRightExpression = {
          evaluate: () => undefined
        };
        const expression = createBinaryExpression({}, mockLeftExpression, '*', mockRightExpression);
        return expect(expression.evaluate()).to.eventually.be.rejectedWith('Cannot multiply these values');
      });

      it('throws if the right value cannot be converted to a number', () => {
        const mockLeftExpression = {
          evaluate: () => createNumericValue(9),
        };
        const mockRightExpression = {
          evaluate: () => createBooleanValue(true),
        };
        const expression = createBinaryExpression({}, mockLeftExpression, '*', mockRightExpression);
        return expect(expression.evaluate()).to.eventually.be.rejectedWith('Cannot multiply these values');
      });

      describe('when both values are numeric', () => {
        let result;

        beforeEach(() => {
          const mockLeftExpression = {
            evaluate: () => createNumericValue(9),
          };
          const mockRightExpression = {
            evaluate: () => createNumericValue(3),
          };
          const expression = createBinaryExpression({}, mockLeftExpression, '*', mockRightExpression);
          result = expression.evaluate();
        });

        it('returns the product of the two numbers', () => {
          return expect(result).to.eventually.satisfy(isNumericValue(27));
        });
      });
    });

    describe('/', () => {
      it('throws if the left value cannot be converted to a number', () => {
        const mockLeftExpression = {
          evaluate: () => ({
            asNativeNumber: () => { throw new Error('Something went wrong'); }
          })
        };
        const mockRightExpression = {
          evaluate: () => ({
            asNativeNumber: () => 9
          })
        };
        const expression = createBinaryExpression({}, mockLeftExpression, '/', mockRightExpression);
        return expect(expression.evaluate()).to.eventually.be.rejectedWith('Something went wrong');
      });

      it('throws if the right value cannot be converted to a number', () => {
        const mockLeftExpression = {
          evaluate: () => ({
            asNativeNumber: () => 9
          })
        };
        const mockRightExpression = {
          evaluate: () => ({
            asNativeNumber: () => { throw new Error('Something went wrong'); }
          })
        };
        const expression = createBinaryExpression({}, mockLeftExpression, '/', mockRightExpression);
        return expect(expression.evaluate()).to.eventually.be.rejectedWith('Something went wrong');
      });

      it('throws if the right value is 0', () => {
        const mockLeftExpression = {
          evaluate: () => ({
            asNativeNumber: () => 9
          })
        };
        const mockRightExpression = {
          evaluate: () => ({
            asNativeNumber: () => 0
          })
        };
        const expression = createBinaryExpression({}, mockLeftExpression, '/', mockRightExpression);
        return expect(expression.evaluate()).to.eventually.be.rejectedWith('Divide by zero');
      });

      describe('when both values are numeric', () => {
        let result;

        beforeEach(() => {
          const mockLeftExpression = {
            evaluate: () => ({
              asNativeNumber: () => 27
            })
          };
          const mockRightExpression = {
            evaluate: () => ({
              asNativeNumber: () => 9
            })
          };
          const expression = createBinaryExpression({}, mockLeftExpression, '/', mockRightExpression);
          result = expression.evaluate();
        });

        it('returns the first divided by the second', () => {
          return expect(result).to.eventually.satisfy(isNumericValue(3));
        });
      });
    });

    describe('%', () => {
      it('throws if the left value cannot be converted to a number', () => {
        const mockLeftExpression = {
          evaluate: () => ({
            asNativeNumber: () => { throw new Error('Something went wrong'); }
          })
        };
        const mockRightExpression = {
          evaluate: () => ({
            asNativeNumber: () => 9
          })
        };
        const expression = createBinaryExpression({}, mockLeftExpression, '%', mockRightExpression);
        return expect(expression.evaluate()).to.eventually.be.rejectedWith('Something went wrong');
      });

      it('throws if the right value cannot be converted to a number', () => {
        const mockLeftExpression = {
          evaluate: () => ({
            asNativeNumber: () => 9
          })
        };
        const mockRightExpression = {
          evaluate: () => ({
            asNativeNumber: () => { throw new Error('Something went wrong'); }
          })
        };
        const expression = createBinaryExpression({}, mockLeftExpression, '%', mockRightExpression);
        return expect(expression.evaluate()).to.eventually.be.rejectedWith('Something went wrong');
      });

      it('throws if the right value is 0', () => {
        const mockLeftExpression = {
          evaluate: () => ({
            asNativeNumber: () => 9
          })
        };
        const mockRightExpression = {
          evaluate: () => ({
            asNativeNumber: () => 0
          })
        };
        const expression = createBinaryExpression({}, mockLeftExpression, '%', mockRightExpression);
        return expect(expression.evaluate()).to.eventually.be.rejectedWith('Divide by zero');
      });

      describe('when both values are numeric', () => {
        let result;

        beforeEach(() => {
          const mockLeftExpression = {
            evaluate: () => ({
              asNativeNumber: () => 27
            })
          };
          const mockRightExpression = {
            evaluate: () => ({
              asNativeNumber: () => 5
            })
          };
          const expression = createBinaryExpression({}, mockLeftExpression, '%', mockRightExpression);
          result = expression.evaluate();
        });

        it('returns the first modulo the second', () => {
          return expect(result).to.eventually.satisfy(isNumericValue(2));
        });
      });
    });

    describe('==', () => {
      it('defers to the equals method', () => {
        const leftExpression = {
          evaluate: () => ({
            equals: () => true
          })
        };
      });
    });

    it('throws when given an unrecognized operator', () => {
      expect(() => createBinaryExpression({}, undefined, 'not defined', undefined)).to.throw('Invalid operator not defined');
    });
  });

  it('throws when evaluated as lhs', () => {
    const expression = createBinaryExpression({}, {}, 'or', {});
    expect(() => expression.evaluateAsLeftHandSide()).to.throw('Cannot assign to binary expression');
  });
});
