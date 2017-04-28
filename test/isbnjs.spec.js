/* eslint no-unused-expressions: 0 */
const { expect } = require('chai')
const ISBN = require('../isbn')

describe('isbn module', function () {
  describe('ISBN', function () {
    describe('parse', function () {
      it('returns an object with all the data when valid', function () {
        expect(ISBN.parse('9791091146135').isValid).to.be.true
      })

      it('returns null for invalid ISBNs', function () {
        expect(ISBN.parse('')).to.be.null
        expect(ISBN.parse('0-00-000-0')).to.be.null
        expect(ISBN.parse('0-00000-0000-0')).to.be.null
        expect(ISBN.parse('00000000000000000')).to.be.null
        expect(ISBN.parse('9788184890261')).to.be.null
      })

      describe('given an ISBN10', function () {
        var isbn

        beforeEach(function () {
          isbn = ISBN.parse('0-7356-1967-0')
        })

        it('detects ISBN standard', function () {
          expect(isbn.isIsbn10).to.be.true
          expect(isbn.isIsbn13).to.be.false
        })

        describe('.codes object', function () {
          it('includes source', function () {
            expect(isbn.source).to.eq('0-7356-1967-0')
          })

          it('does not include prefix', function () {
            expect(isbn.prefix).to.be.undefied
          })

          it('includes group id', function () {
            expect(isbn.group).to.eq('0')
          })

          it('includes group name', function () {
            expect(isbn.groupname).to.eq('English language')
          })

          it('includes publisher id', function () {
            expect(isbn.publisher).to.eq('7356')
          })

          it('includes article id', function () {
            expect(isbn.article).to.eq('1967')
          })

          it('includes check digits for ISBN10/13', function () {
            expect(isbn.check10).to.eq('0')
            expect(isbn.check13).to.eq('8')
          })

          it('includes plain and hyphenated versions of ISBN10/13', function () {
            expect(isbn.isbn10).to.eq('0735619670')
            expect(isbn.isbn10h).to.eq('0-7356-1967-0')
            expect(isbn.isbn13).to.eq('9780735619678')
            expect(isbn.isbn13h).to.eq('978-0-7356-1967-8')
          })
        })
      })

      describe('given an ISBN13', function () {
        var isbn

        describe('with prefix 978', function () {
          beforeEach(function () {
            isbn = ISBN.parse('978-3-642-38745-6')
          })

          it('detects ISBN standard', function () {
            expect(isbn.isIsbn10).to.be.false
            expect(isbn.isIsbn13).to.be.true
          })

          describe('.codes object', function () {
            it('includes source', function () {
              expect(isbn.source).to.eq('978-3-642-38745-6')
            })

            it('includes prefix', function () {
              expect(isbn.prefix).to.eq('978')
            })

            it('includes group id', function () {
              expect(isbn.group).to.eq('3')
            })

            it('includes group name', function () {
              expect(isbn.groupname).to.eq('German language')
            })

            it('includes publisher id', function () {
              expect(isbn.publisher).to.eq('642')
            })

            it('includes article id', function () {
              expect(isbn.article).to.eq('38745')
            })

            it('includes check digits for ISBN10/13', function () {
              expect(isbn.check10).to.eq('4')
              expect(isbn.check13).to.eq('6')
            })

            it('includes plain and hyphenated versions of ISBN10/13', function () {
              expect(isbn.isbn10).to.eq('3642387454')
              expect(isbn.isbn10h).to.eq('3-642-38745-4')
              expect(isbn.isbn13).to.eq('9783642387456')
              expect(isbn.isbn13h).to.eq('978-3-642-38745-6')
            })
          })
        })

        describe('with prefix 979', function () {
          it('does not try to "map" it to ISBN10', function () {
            expect(ISBN.asIsbn10('9791091146135')).to.be.null
          })

          describe('.codes object', function () {
            beforeEach(function () {
              isbn = ISBN.parse('9791091146135')
            })
            it('includes prefix', function () {
              expect(isbn.prefix).to.eq('979')
            })

            it('includes group id', function () {
              expect(isbn.group).to.eq('10')
            })

            it('includes group name', function () {
              expect(isbn.groupname).to.eq('France')
            })
          })
        })
      })
    })

    describe('.asIsbn13()', function () {
      it('converts ISBN10 to ISBN13', function () {
        expect(ISBN.asIsbn13('4-87311-336-9')).to.eq('9784873113364')
      })

      it('accepts ISBN13 as well', function () {
        expect(ISBN.asIsbn13('978-4-87311-336-4')).to.eq('9784873113364')
      })

      it('hyphenates result', function () {
        expect(ISBN.asIsbn13('4-87311-336-9', true)).to.eq('978-4-87311-336-4')
      })

      it('returns null if ISBN is invalid', function () {
        expect(ISBN.asIsbn10('4873113361')).to.be.null
      })
    })

    describe('.asIsbn10()', function () {
      it('converts ISBN13 to ISBN10', function () {
        expect(ISBN.asIsbn10('978-4-87311-336-4')).to.eq('4873113369')
      })

      it('accepts ISBN10 as well', function () {
        expect(ISBN.asIsbn10('4-87311-336-9')).to.eq('4873113369')
      })

      it('hyphenates result', function () {
        expect(ISBN.asIsbn10('978-4-87311-336-4', true)).to.eq('4-87311-336-9')
      })

      it('returns null if ISBN is invalid', function () {
        expect(ISBN.asIsbn10('9790000000000')).to.be.null
      })
    })

    describe('.hyphenate()', function () {
      it('hyphenates ISBN10s', function () {
        expect(ISBN.hyphenate('4873113369')).to.eq('4-87311-336-9')
      })

      it('hyphenates ISBN13s', function () {
        expect(ISBN.hyphenate('9784873113364')).to.eq('978-4-87311-336-4')
        expect(ISBN.hyphenate('9791091146135')).to.eq('979-10-91146-13-5')
      })

      it('does not refuse hyphenated ISBNs', function () {
        expect(ISBN.hyphenate('4-87311-336-9')).to.eq('4-87311-336-9')
        expect(ISBN.hyphenate('978-4-87311-336-4')).to.eq('978-4-87311-336-4')
      })

      it('returns null for non-valid ISBN', function () {
        expect(ISBN.hyphenate('4873113360')).to.be.null
        expect(ISBN.hyphenate('9784873113360')).to.be.null
      })
    })
  })
})
