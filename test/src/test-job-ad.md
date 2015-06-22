---
template: job-ad.html
relative_path_to_root: ../../build/
greenhouse:
  jobs:
    - id: 1234
      title: 'Test job'
      location:
        name: 'Nowhere land'
      locations: 'Nowhere land'
      department:
        name: 'Test department'
      firstCategoryId: 'testing'
      firstCategory: 'Testing'
      content: '<p>It is a nice job, please apply now!</p>'
      questions:
        - label: 'Name'
          required: true
          fields:
            - type: 'input_text'
              name: 'applicant_name'
        - label: 'CV'
          fields:
            - type: 'input_file'
              name: 'applicant_cv_file'
            - type: 'textarea'
              name: 'applicant_cv_text'
        - label: 'How did you hear about this job?'
          required: true
          fields:
            - type: 'multi_value_single_select'
              name: 'applicant_referrer'
              values:
              - value: 1
                label: 'Friend'
              - value: 2
                label: 'Media'
              - value: 3
                label: 'Search engine'
---
